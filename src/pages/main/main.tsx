import {getDocs,collection, query, where, doc, deleteDoc, documentId} from 'firebase/firestore'
import { auth,db } from '../../config/firebase';
import { useEffect, useState } from 'react';
import { Post } from './post';
import { useAuthState } from 'react-firebase-hooks/auth';

export interface Post {
    id: string,
    userId: string,
    title: string,
    username: string,
    description: string,
}
export const Main = () => {
    const [user] = useAuthState(auth);
    const postsRef = collection(db,"posts");
    const [postsList,setPostsList] = useState<Post[] | null>(null)
    const getPosts = async () => {
        const data = await getDocs(postsRef);
        setPostsList(data.docs.map((doc) => ({...doc.data(), id: doc.id})) as Post[]);
    }
    useEffect(()=>{
        getPosts();
    },[])
    const removePost = async (postId:string) => {
        try{
            const postToDeleteQuery = query(
                postsRef, 
                where(documentId(),"==", postId), 
                where("userId", "==" , user?.uid),
                //documentId is for getting the collection's document id.
            );
            const postToDeleteData = await getDocs(postToDeleteQuery);
            const postToDelete = doc(db,"posts",postToDeleteData.docs[0].id);
            await deleteDoc(postToDelete);
            getPosts();
        } 
        catch(err){
            console.log(err);
        }
    };

    return (
        <div>
            {   postsList?.map(
                    (post) => (
                    <Post post={post} removePost={removePost} />
                    )
                )
            }
        </div>
    );
};