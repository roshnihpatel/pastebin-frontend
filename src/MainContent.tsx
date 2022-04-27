import { useState, useEffect } from "react";
import axios from "axios";

interface Paste {
  id: number;
  content: string;
  title: string;
}

export default function MainContent(): JSX.Element {
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [pastes, setPastes] = useState<Paste[]>([]);
  const [counter, setCounter] = useState<number>(0);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(
        `https://roshni-christian-pastebin.herokuapp.com/pastes/${id}`
      );
      setPastes(pastes.filter((paste) => paste.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = async () => {
    const data = { content: content, title: title };
    if (content.length === 0) {
      window.alert("can't have an empty paste");
    } else {
      await axios.post(
        "https://roshni-christian-pastebin.herokuapp.com/pastes",
        data
      );
      const counterPlusOne = counter + 1;
      setCounter(counterPlusOne);
      console.log(counter);
      setContent("");
      setTitle("");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get("https://roshni-christian-pastebin.herokuapp.com/pastes")
        .then((response) => {
          const data = response.data;
          setPastes(data);
          console.log(data);
        });
    };
    fetchData();
  }, [counter]);

  return (
    <>
      <input
        className="title-input"
        placeholder="type here"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="input"
        placeholder="type here"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleClick}>Submit</button>

      <ul>
        {pastes.map((paste) => {
          return (
            <li key={paste.id}>
              {paste.title}:{paste.content}
              <button
                className="delete-button"
                onClick={() => handleDelete(paste.id)}
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
