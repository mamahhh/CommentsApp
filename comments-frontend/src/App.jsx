import "./App.css";
import { Comments } from "./Components/Comments";

function App() {
  return (
    <div className="comments_section">
      <div className="title my-2">
        <h1 className="font-bold">Comments</h1>
      </div>
      <Comments />
    </div>
  );
}

export default App;
