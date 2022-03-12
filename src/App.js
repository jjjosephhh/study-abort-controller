/*
Resources used to create this example
https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
*/
import { useState } from "react";
import "./App.css";

const useIntForm = () => {
  const [form, setForm] = useState({});
  const handleChange = ({ target: { name, value } }) =>
    setForm({ ...form, [name]: value ? parseInt(value) : 0 });
  const onSubmit = (action) => (event) => {
    event.preventDefault();
    if (action) action();
  };
  return { form, handleChange, onSubmit };
};

function App() {
  const { form, handleChange, onSubmit } = useIntForm();

  const sendSlowRequest = async () => {
    const ctrl = new AbortController();

    // the signal is like a homing beacon inside of your asynchronous
    // function call
    const signal = ctrl.signal;

    // "abort"ing the function is like terminating it, but if the
    // beacon is out of range (i.e. the request has already completed)
    // then no harm no foul, it just does nothing
    setTimeout(() => ctrl.abort(), form.requestTimeout * 1000);
    try {
      const response = await fetch(
        `http://localhost:8080/${form.serverDelay}`,
        { signal }
      );
      const data = await response.json();
      alert(data.message);
    } catch (e) {
      // if the asynchronous function call is aborted, the
      // exception will have the name "AbortError", you can
      // place your recovery logic in here
      if (e.name === "AbortError") {
        alert("Request was aborted!");
      } else {
        alert(JSON.stringify(e));
      }
    }
  };

  return (
    <div className="pure-g">
      <div className="pure-u-1-3" />
      <div className="pure-u-1-3">
        <div className="app-container">
          <form
            onSubmit={onSubmit(sendSlowRequest)}
            className="pure-form pure-form-stacked"
          >
            <fieldset>
              <legend>Cancelling a request</legend>
              <label htmlFor="server-delay">Server Delay</label>
              <input
                className="my-input"
                name="serverDelay"
                onChange={handleChange}
                required
                type="number"
                id="server-delay"
                placeholder="How slow do you want the response to be?"
              />
              <span className="pure-form-message">
                How long you want the server delay to be in sec.
              </span>
              <label htmlFor="request-timeout">Request Timeout</label>
              <input
                className="my-input"
                name="requestTimeout"
                onChange={handleChange}
                type="number"
                id="request-timeout"
                placeholder="How patient are you?"
              />
              <span className="pure-form-message">
                How long to wait before cancelling the request
              </span>
              <br />
              <button type="submit" className="pure-button pure-button-primary">
                Send Request
              </button>
            </fieldset>
          </form>
        </div>
      </div>
      <div className="pure-u-1-3" />
    </div>
  );
}

export default App;
