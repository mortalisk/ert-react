import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import React, {useState, useEffect, memo} from 'react';
import Immutable from 'immutable'

const Real = memo(function (props) {
  console.log('draw');
  const cls = {
    'JOB_QUEUE_UNKNOWN': 'real-unknown',
    'JOB_QUEUE_RUNNING': 'real-running',
    'JOB_QUEUE_SUCCESS': 'real-done',
    'JOB_QUEUE_FAILURE': 'real-failed'
  }[props.real.get('queue_state', 'JOB_QUEUE_UNKNOWN')];

  var jobs = jobsOfReal(props.real);
  var width = 100.0/jobs.size;
  return <div className={"real " + cls} onClick={() => props.onClick(props.id)}>
    {jobs.entrySeq().map(([id, job]) =>
        <div key={id} className={"job job-"+job.get('status')} style={{height: "100%", width: width + "%"}}></div>
    )}
  </div>;
});


function jobsOfReal(real) {
  return real.get('steps').flatMap((step, _id) => step.get('jobs'));
}

const JobDetails = memo(function(props) {
  return <tr className={"job-"+props.job.get("status")}><td>{props.job.get('name')}</td><td>{props.job.get('status')}</td></tr>
});

const RealDetails = memo(function(props) {
  return (<table className="table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
    {jobsOfReal(props.real).entrySeq().map(([id, job]) => <JobDetails job={job} key={id}/>)}
    </tbody>
  </table>);
});

const Iter = memo(function(props) {
  const [snapshots, setSnapshots] = useState(Immutable.fromJS({
    status: "Not connected",
    reals: {}
  }));
  const [iteration, setIteration] = useState(0)
  const [selected, setSelected] = useState("")
  useEffect(() => {
    console.log('connecting')
     window.connect(setSnapshots())
  }, []);

  function realClicked(real_id) {
    console.log("clicked " + real_id);
    setSelected(real_id)
  }

  var reals = snapshots.get(iteration).get("reals");
  return (
    <div className="container">
        <div className="head">
        <img src="window_icon.png" className="App-logo" alt="logo" />
        <p>
          Status is {state.get("status")}
        </p>
        </div>
        <div className="d-flex align-content-start flex-wrap overflow-auto reals">
          {
            reals.entrySeq().map(([id, real]) => <Real key={id} real={real} id={id} onClick={setSelected} />)
          }
        </div>
        <div className="real-details overflow-auto">
        {
            selected !== "" && <RealDetails real={reals.get(selected)}/>
        }
        </div>
    </div>
  );
});

const App = memo(function(props) {

});

export default App;
