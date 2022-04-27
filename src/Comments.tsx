import { useEffect, useState } from "react";
import axios from "axios";

interface Comment {
  id: number;
  paste_id: number;
  comment: string;
  timestamp: string;
}

interface Props {
  paste_id: number;
}
export default function Comments({ paste_id }: Props): JSX.Element {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [counter, setCounter] = useState<number>(0);

  const handleClick = async () => {
    try {
      const data = { comment: newComment };
      console.log(newComment);
      await axios.post(
        `https://roshni-christian-pastebin.herokuapp.com/pastes/${paste_id}/comment`,
        data
      );
      setNewComment("");
      const counterPlusOne = counter + 1;
      setCounter(counterPlusOne);
    } catch (err) {
      console.log(err);
    }
  };
  const handleDeleteComment = async (comment_id: number) => {
    try {
      axios.delete(
        `https://roshni-christian-pastebin.herokuapp.com/pastes/${paste_id}/comment/${comment_id}`
      );
      setComments(comments.filter((comment) => comment.id !== comment_id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(
          `https://roshni-christian-pastebin.herokuapp.com/pastes/${paste_id}/comment`
        )
        .then((response) => {
          const data = response.data;
          setComments(data);
        });
    };
    fetchData();
    // eslint-disable-next-line
  }, [counter]);

  return (
    <>
      <input
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button onClick={handleClick}>post</button>
      <div key={paste_id} className="comments-section">
        <ul>
          {comments.map((comment) => {
            return (
              <div key={comment.id} className="single-comment">
                <li>{comment.comment}</li>
                <button onClick={() => handleDeleteComment(comment.id)}>
                  delete
                </button>
              </div>
            );
          })}
        </ul>
      </div>
    </>
  );
}
