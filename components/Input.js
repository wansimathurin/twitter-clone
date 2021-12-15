import React,{useState,useRef} from 'react';
import {
    CalendarIcon,
    ChartBarIcon,
    EmojiHappyIcon,
    PhotographIcon,
    XIcon,
  } from "@heroicons/react/outline";
  import 'emoji-mart/css/emoji-mart.css';
  import { Picker } from 'emoji-mart';
  import { db, storage } from "../firebase";
  import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    updateDoc,
  } from "@firebase/firestore";
  import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { useSession } from 'next-auth/react';

function Input() {
    const { data: session } = useSession();//get te session
    const [loading, setloading] = useState(false)
    const sendPost= async()=>{
        if(loading) return;
        setloading(true);
        const docRef = await addDoc(collection(db,'posts'),{
            id: session.user.uid,
            username: session.user.name,
            userImg: session.user.image,
            tag: session.user.tag,
            text: input,
            timestamp: serverTimestamp(),
        });
        const imageRef = ref(storage,`post/${docRef.id}/image`);
        if (selectedFile) {
            await uploadString(imageRef,selectedFile,"data_url").then(async()=>{
                const downloadURL = await getDownloadURL(imageRef)
                await updateDoc(doc(db,"posts",docRef.id),{
                    image: downloadURL,
                });
            });
        }
        setloading(false);
        setinput("");
        setselectedFile(null);
        setshowEmojis(false);
    };
    const [input, setinput] = useState("");
    const [selectedFile, setselectedFile] = useState(null);
    const filePickerRef = useRef(null);
     const [showEmojis, setshowEmojis] = useState(false)
    const addImageToPost =(e)=>{ 
        const reader = new FileReader();
        if(e.target.files[0]){
            reader.readAsDataURL(e.target.files[0]);
        } 
        reader.onload = (readerEvent)=>{
            setselectedFile(readerEvent.target.result)
        }
    }
    const addEmoji = (e) => {
        let sym = e.unified.split("-");
        let codesArray = [];
        sym.forEach((el) => codesArray.push("0x" + el));
        let emoji = String.fromCodePoint(...codesArray);
        setinput(input + emoji);
      };
    return (
        <div className={`border-b border-gray-700 p-3 flex space-x-3 overflow-y-scroll ${loading && "opacity-60"}`}>
            <img className="h-11 w-11 cursor-pointer rounded-full" src={session.user.image}/> 
            <div className="w-full divide-y divide-gray-700">
                <div className={`${selectedFile && "pb-7"} ${input && "space-y-2.5"}`}>
                    <textarea value={input} onChange={(e)=>setinput(e.target.value)} name="" placeholder="What's happening..?" className="bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full min-h-[50px]"  rows="2"></textarea>
                     {selectedFile && (
                         <div className="relative">
                         <div onClick={()=>setselectedFile(null)} className="absolute w-8 h8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 items-center justify-center top-1 left-1 cursor-pointer">
                         <XIcon className="text-white h-5" />
                         </div>
                         <img src={selectedFile} alt=""  className="rounded-2xl max-h-8o object-contain"/>
                      </div>
                     )}
                </div>
                {!loading && (
                         <div className="flex items-center justify-between pt-2 5">
                         <div className="flex items-center">
                             <div className="icon" onClick={()=>filePickerRef.current.click()}>
                                 <PhotographIcon className="h-[22px] text-[#1d9bf0]"/>
                                 <input type="file" hidden onChange={addImageToPost} ref={filePickerRef}/>
                             </div>
                                 <div className="icon rotate-90">
                                    <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
                                </div>
    
                                <div className="icon" onClick={() => setshowEmojis(!showEmojis)}>
                                    <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
                                </div>
    
                                <div className="icon">
                                    <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
                                </div>
                                {showEmojis &&(
                                     <Picker
                                     onSelect={addEmoji}
                                     style={{
                                       position: "absolute",
                                       marginTop: "465px",
                                       marginLeft: -40,
                                       maxWidth: "320px",
                                       borderRadius: "20px",
                                     }}
                                     theme="dark"
                                   />
                                )}
                         </div>
                                    <button
                            className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
                            disabled={!input.trim() && !selectedFile}
                            onClick={sendPost}
                            >
                            Tweet
                            </button>
                     </div>
                )}
             
            </div>
        </div>
    )
}

export default Input
