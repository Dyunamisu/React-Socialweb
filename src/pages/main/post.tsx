import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/firebase";
import { Post as IPost } from "./main"
import { addDoc, getDocs,  collection , query, where ,deleteDoc, doc} from "firebase/firestore";
import { useEffect, useState } from "react";
import { CommentPost } from "./comment";

interface Props {
    post: IPost;
    removePost:any;
}
interface Like{
    likeId:string,
    userId:string;
}
export interface Comment{
    username:string,
    userId:string,
    userComment:string;
    commentId:number
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
    const removeLikes = async () => { 
        // remove all the like of a post at once
        try{
            const likeToDeleteQuery = query(
                likesRef, 
                where("postId","==", post.id), 
            );
            const likeToDeleteData = await getDocs(likeToDeleteQuery);
            likeToDeleteData.docs.map(
                async (likeData) => {
                    const likeToDelete = doc(db,"likes",likeData.id)
                    await deleteDoc(likeToDelete);
                }
            )
            getLikes();
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
        setCommentsList(data.docs.map((doc) =>({
            userId: doc.data().userId, 
            userComment:doc.data().userComment,
            username:doc.data().username,
            commentId:doc.data().commentId
        })));
    };
    const addComment = async () => {
        
        await addDoc(commentsRef,{
            userId: user?.uid,
            postId: post.id,
            username:user?.displayName,
            userComment:newComment,
            commentId:commentsList?.length,
        })
        getComments();
        
    };
    const removeComment = async (commentId:number) => {
        try{
            const commentToDeleteQuery = query(
                commentsRef, 
                where("postId","==", post.id), 
                where("userId", "==" , user?.uid),
                where("commentId","==", commentId)
            );
            const commentToDeleteData = await getDocs(commentToDeleteQuery);
            const commentToDelete = doc(db,"comments",commentToDeleteData.docs[0].id);
            await deleteDoc(commentToDelete);
            getComments();
        } catch(err){
            console.log(err);
        }
    };
    const removeComments = async () => { 
        //this is for remove all comments when deleted post
        try{
            const commentToDeleteQuery = query(
                commentsRef, 
                where("postId","==", post.id), 
            );
            const commentToDeleteData = await getDocs(commentToDeleteQuery);
            
            commentToDeleteData.docs.map(async (commentData)=>{
                const commentToDelete = doc(db,"comments",commentData.id);
                await deleteDoc(commentToDelete);
            })
            getComments();
        } catch(err){
            console.log(err);
        } 
    };
    useEffect(() =>{
        getComments();
    },[])

    return (
        <div className="post">
            {post.userId === user?.uid && <button className="delete" onClick={
                    ()=>{
                        if(post.userId === user?.uid){
                            props.removePost(post.id)
                            removeComments();
                            removeLikes();
                        }
                    }
                }>X
            </button>}
            <div className="title">
                <h1>{post.title}</h1>
            </div>
            <div className="body">
                <p><>&#128269;</>{post.description}</p>
            </div>
            <div className="footer">
                <p>@{post.username}</p>
                <button onClick={hasUserLiked ? removeLike : addLike }> {hasUserLiked ? <>&#128078;</> : <>&#128077;</>} </button>
                {likes && <p>Likes:{likes?.length}</p> }
            </div>
            <div className="comment">
                <div>{commentsList?.map((eachComment) => (<CommentPost comment={eachComment} removeComment={removeComment}/>))}</div>
                <div className="enterComment">
                    <input type="text" placeholder="type your comment here..." onChange={(event)=>{handleChange(event)}}></input>
                    <button onClick={addComment}>Add Comment</button>
                </div>
            </div>
        </div>
    )
}