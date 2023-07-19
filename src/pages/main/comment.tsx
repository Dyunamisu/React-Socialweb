import { Comment as IComment } from "./post"

interface Props {
    comment: IComment;
    removeComment: any;
}
export const CommentPost = (props: Props) => {
    const removeComment = props.removeComment;
    const userComment = props.comment.userComment;
    const username = props.comment.username;
    const commentId = props.comment.commentId;
    return (
        <div className="comment">
            {userComment} by {username}
            <button onClick={()=>removeComment(commentId)}>X</button>
        </div>
    )
}