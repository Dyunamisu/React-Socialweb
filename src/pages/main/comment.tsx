import { Comment as IComment } from "./post"
import { auth } from '../../config/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
interface Props {
    comment: IComment;
    removeComment: any;
}
export const CommentPost = (props: Props) => {
    const removeComment = props.removeComment;
    const commentId = props.comment.commentId;
    const [user] = useAuthState(auth);
    return (
        <div className="showedComment">
              <span>
                {props.comment.username}: {props.comment.userComment}
              </span>
             {props.comment.userId === user?.uid && <button id="deleteComment" onClick={()=>removeComment(commentId)}>X</button>}
        </div>
    )
}