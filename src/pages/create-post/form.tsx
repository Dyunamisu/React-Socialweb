import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { addDoc,collection } from 'firebase/firestore'; //collection is a function to add to which collection(table)
import { auth,db } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from "react-router-dom"

interface CreateFormData{
    title:string;
    description:string
}

export const CreateForm = () =>{

    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    const schema = yup.object().shape({
        title: yup.string().required("You must add a title."),
        description: yup.string().required("You must add a description."),
    });

    const { register , handleSubmit , formState:{errors}  , } = useForm<CreateFormData>({
        resolver: yupResolver(schema),
    });

    const postsRef = collection(db,"posts"); //collecition to which db database and to which collecitons (posts)

    const onCreatePost = async (data : CreateFormData) => {
        await addDoc(postsRef,{
            ...data,
            username:user?.displayName,
            userId:user?.uid,
        })
        navigate("/")
    };

    return (
        <form className='formName' onSubmit={handleSubmit(onCreatePost)}>
         <div className='titleBar'>
            <input className='title' placeholder='Title...'{...register("title")}/>
            <p>{errors.title?.message}</p>
         </div>
         <div className='textArea'>
             <textarea placeholder='Description...'{...register("description")}/>
            <p>{errors.description?.message}</p>
         </div>
         <input id='submitPost' type='submit'/>
        </form>
    );
};