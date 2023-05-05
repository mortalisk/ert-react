import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Immutable from 'immutable'

function merger(a, b) {
  if (a && a.mergeWith && !Immutable.List.isList(a) && !Immutable.List.isList(b)) {
    return a.mergeWith(merger, b)
  }
  return b
}

window.connect = function(setState) {
  var snapshot = undefined
  const socket = new WebSocket('ws://10.0.10.228:51835/client', );
  socket.addEventListener('message', function (event) {
      var cloudEvent = JSON.parse(event.data);
      if (cloudEvent['type'] === 'com.equinor.ert.ee.snapshot') {
        const reviver = (key, value) =>
          Immutable.Iterable.isKeyed(value) ? value.toOrderedMap() : value.toList();
        var data = JSON.parse(cloudEvent['data'])
        snapshot = Immutable.fromJS(data, reviver);
        setState(snapshot)
      } else if (cloudEvent['type'] === 'com.equinor.ert.ee.snapshot_update') {
        var data = JSON.parse(cloudEvent['data'])
        const update = Immutable.fromJS(data);
        snapshot = snapshot.mergeWith(merger, update)
        setState(snapshot)
      } else {
        console.log('Unknowns Message from server ', cloudEvent);
      }
  });
  socket.addEventListener('close', function(event) {

      console.log('close')
    setTimeout(() => window.connect(setState), 1000);
  });

}

ReactDOM.render(
    <App/>,
  document.getElementById('root')
);
