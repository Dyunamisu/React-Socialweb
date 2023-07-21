import { Comment as IComment } from "./post"
interface Props {
    comment: IComment;
    removeComment: any;
}
export const CommentPost = (props: Props) => {
    const removeComment = props.removeComment;
    const commentId = props.comment.commentId;
    return (
        <div className="comment">
              <span className="showedComment">
                {props.comment.username}: {props.comment.userComment}
              </span>
             <button onClick={()=>removeComment(commentId)}>X</button>
        </div>
    )
}