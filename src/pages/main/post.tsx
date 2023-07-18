import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/firebase";
import { Post as IPost } from "./main"
import { addDoc, getDocs,  collection , query, where ,deleteDoc, doc} from "firebase/firestore";
import { useEffect, useState } from "react";
import { CommentPost } from "./comment";

interface Props {
    post: IPost;
}
interface Like{
    likeId:string,
    userId:string;
}
export interface Comment{
    userId:string,
    userComment:string;
}

export const Post = (props: Props) => {
    const [likes,setLikes] = useState<Like[] | null>(null)
    const { post } = props;
    const [user] = useAuthState(auth);
    const likesRef = collection(db,"likes"); //collecition to which db database and to which collecitons (posts)
    const likesDoc = query(likesRef, where("postId","==", post.id));

    const getLikes = async () => {
        const data = await getDocs(likesDoc);
        setLikes(data.docs.map((doc) =>({userId: doc.data().userId, likeId:doc.id}) ));
    };
    const addLike = async () => {
        try{
            const newDoc = await addDoc(likesRef,{
                userId: user?.uid,
                postId: post.id,
            })
            if(user){
             setLikes((prev) => prev ? [...prev, {userId: user.uid, likeId: newDoc.id}] : [{userId: user.uid,likeId: newDoc.id}])
            }
        } catch(err){
            console.log(err);
        }
        
    };
    const removeLike = async () => {
        try{
            const likeToDeleteQuery = query(
                likesRef, 
                where("postId","==", post.id), 
                where("userId", "==" , user?.uid)
            );
            const likeToDeleteData = await getDocs(likeToDeleteQuery);
            const likeId = likeToDeleteData.docs[0].id
            const likeToDelete = doc(db,"likes",likeToDeleteData.docs[0].id);
            await deleteDoc(likeToDelete);
            if(user){
             setLikes((prev)=>prev && prev.filter((like)=>like.likeId !== likeId ));
            }
        } catch(err){
            console.log(err);
        }
        
    };
    const hasUserLiked = likes?.find((like)=> like.userId === user?.uid);
    useEffect(() =>{
        getLikes();
    },[])

    const [newComment,setNewComment] = useState<string | null>(null)
    const [commentsList,setCommentsList] = useState<Comment[] | null>(null)
    const commentsRef = collection(db, "comments")
    const commentsDoc = query(commentsRef, where("postId","==",post.id))
    
    const handleChange = (event: any) =>{
        setNewComment(event.target.value);
    }
    const getComments = async () => {
        const data = await getDocs(commentsDoc);
        setCommentsList(data.docs.map((doc) =>({userId: doc.data().userId, userComment:doc.data().userComment}) ));
    };
    const addComment = async () => {
        
        const newDoc = await addDoc(commentsRef,{
            userId: user?.displayName,
            postId: post.id,
            userComment:newComment,
        })
        getComments();
        
    };
    useEffect(() =>{
        getComments();
    },[])



    return (
        <div className="post">
            <div className="title">
                <h1>{post.title}</h1>
            </div>
            <div className="body">
                <p>{post.description}</p>
                <div>{commentsList?.map((abcde) => (<CommentPost comment={abcde}/>))}</div>
            </div>
            <div className="comment">
                <input type="text" placeholder="type your comment here..." onChange={(event)=>{handleChange(event)}}></input>
                <button onClick={addComment}>Add Comment</button>
            </div>
            <div className="footer">
                <p>@{post.username}</p>
                <button onClick={hasUserLiked ? removeLike : addLike }> {hasUserLiked ? <>&#128078;</> : <>&#128077;</>} </button>
                {likes && <p>Likes:{likes?.length}</p> }
            </div>
        </div>
    )
}