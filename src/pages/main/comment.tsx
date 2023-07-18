import { Comment as IComment } from "./post"

interface Props {
    comment: IComment;
}
export const CommentPost = (props: Props) => {
    return <div className="comment">{props.comment.userComment} by {props.comment.userId}</div>
}