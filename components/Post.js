import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    setDoc,
  } from "@firebase/firestore";
  import {
    ChartBarIcon,
    ChatIcon,
    DotsHorizontalIcon,
    HeartIcon,
    ShareIcon,
    SwitchHorizontalIcon,
    TrashIcon,
  } from "@heroicons/react/outline";
  import {
    HeartIcon as HeartIconFilled,
    ChatIcon as ChatIconFilled,
  } from "@heroicons/react/solid";
  import { useSession } from "next-auth/react";
  import { useRouter } from "next/router";
  import { useEffect, useState } from "react";
import { Snapshot,  useRecoilState } from "recoil";
import { modalState, postIdState } from "../atoms/modalAtom";
  import Moment from "react-moment";
  

//   import { useRecoilState } from "recoil";

  import { db } from "../firebase";

function Post({id,post,postPage}) {
    const { data: session } = useSession();
    const [isOpen, SetIsOpen] = useRecoilState(modalState);
    const [comments, setcomments] = useState([]);
    const [postId, setPostId] = useState(postIdState);
    const [liked, setliked] = useState(false);
    const [likes, setLikes] = useState([])
    const router = useRouter();
    useEffect(
        () =>
          onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
            setLikes(snapshot.docs)
          ),
        [db, id]
      );
    //   check if a user has already liked a post and decrement it.
      useEffect(
        () =>
          setliked(
            likes.findIndex((like) => like.id === session?.user?.uid) !== -1
          ),
        [likes]
      );
    //   like post functionality
    const likePost = async()=>{
        if(liked){
            await deleteDoc(doc(db,"posts", id,"likes",session.user.uid))
        }else{
            await setDoc(doc(db,"posts",id,"likes",session.user.uid),{
                username: session.user.name,
            })
        }
    }
    return (
        <div className="p-3 flex cursor-pointer border-b border-gray-700" onClick={()=>router.push(`/${id}`)}>
            {!postPage && <img src={post?.userImg} alt="" className="h-11 w-11 rounded-full mr-4" />}
            <div className="flex flex-col space-y-2 w-full">
                <div className={`flex ${!postPage && "justify-between"}`}>
                     {postPage && (
                         <img src={post?.userImg}
                          alt="Profile pic" className="h-11 w-11 rounded-full mr-4" />//user profile picture
                     )}
                     <div className="text-[#6e767d]">
                          <div className="inline-block group">
                              <h4 className={`font-bold text-[15px] sm:text-base text-[#d9d9d9] group-hover:underline ${!postPage && "inline-block"}`}>{post?.username}</h4>
                              <span className={`text-sm sm:text-[15px] ${!postPage && "ml-1.5"}`}>@{post?.tag}</span>
                          </div>{""}
                          . {""}
                          <span className="hover:underline text-sm sm:text-[15px]">
                              <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
                          </span>
                          {!postPage && (
                              <p className="text-[#d9d9d9]  text-[15px] sm:text-base mt-0.5"> {post?.text} </p>
                          )}
                     </div>
                     <div className="icon group flex-shrink-0 ml-auto">
                            <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
                    </div>
                   
                </div>
                {postPage && (
                        <p className="text-[#d9d9d9]  text-[15px] sm:text-base mt-0.5"> {post?.text} </p>
                    )}
                    <img src={post?.image}  alt="" className="rounded-2xl max-h-[700px] object-cover mr-2" />
                    <div className={`text-[#6e767d] flex justify-between w-10/12 ${postPage && "mx-auto"}`}>
                   {/* comment section */}
                    <div className="flex items-center space-x-1 group"
                            onClick={(e) => {
                            e.stopPropagation();
                            setPostId(id);
                            SetIsOpen(true);
                            }}
                        >
                            <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10">
                            <ChatIcon className="h-5 group-hover:text-[#1d9bf0]" />
                            </div>
                            {comments.length > 0 && (
                            <span className="group-hover:text-[#1d9bf0] text-sm">
                                {comments.length}
                            </span>
                            )}
                        </div>
                         {/* deleting post */}
                        {session.user.uid === post?.id ? (
                            <div
                            className="flex items-center space-x-1 group"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteDoc(doc(db, "posts", id));
                                router.push("/");
                            }}
                            >
                            <div className="icon group-hover:bg-red-600/10">
                                <TrashIcon className="h-5 group-hover:text-red-600" />
                            </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-1 group">
                            <div className="icon group-hover:bg-green-500/10">
                                <SwitchHorizontalIcon className="h-5 group-hover:text-green-500" />
                            </div>
                            </div>
                        )}
                        {/* like heart section */}

                        <div
                            className="flex items-center space-x-1 group"
                            onClick={(e) => {
                            e.stopPropagation();
                            likePost();
                            }}
                        >
                            <div className="icon group-hover:bg-pink-600/10">
                            {liked ? (
                                <HeartIconFilled className="h-5 text-pink-600" />
                            ) : (
                                <HeartIcon className="h-5 group-hover:text-pink-600" />
                            )}
                            </div>
                            {likes.length > 0 && (
                            <span
                                className={`group-hover:text-pink-600 text-sm ${
                                liked && "text-pink-600"
                                }`}
                            >
                                {likes.length}
                            </span>
                            )}
                        </div>
                        {/* end heart */}
                        <div className="icon group">
                            <ShareIcon className="h-5 group-hover:text-[#1d9bf0]" />
                        </div>
                        <div className="icon group">
                            <ChartBarIcon className="h-5 group-hover:text-[#1d9bf0]" />
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default Post
