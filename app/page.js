"use client"
import { ThumbsUpIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { generateToken } from "@/func/generate_token"
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import rehypePrettyCode from "rehype-pretty-code";
import { transformerCopyButton } from '@rehype-pretty/transformers'
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const router = useRouter()
  const [postArr, setPostArr] = useState([])
  const [chunksArr, setChunksArr] = useState()
  const [indexOfchunksArr, setIndexOfChunksArr] = useState(0)
  const [htmlContent, setHtmlContent] = useState([])
  const { toast } = useToast()

  const getArryPost = async (chunksArr) => {
    if (chunksArr) {
      const { token, id } = await generateToken()
      if (!chunksArr[indexOfchunksArr]) {
        toast({
          description: `❌ No post is available`,
        })
        return
      }
      const postDetailsReq = await fetch("/api/user/getPostDetailsBulk", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ uidArr: chunksArr[indexOfchunksArr], id })
      })
      const postDetailsRes = await postDetailsReq.json()
      if (postDetailsRes.success) {
        setPostArr(prevPostArr => [...prevPostArr, ...postDetailsRes.postArr]);
        setIndexOfChunksArr(indexOfchunksArr + 1)
      } else {
        toast({
          description: `❌ ${postDetailsRes.message}`,
        })
      }
    }
  }
  useEffect(() => {
    const getChunksArr = async (uidArr) => {
      let chunksArr = []
      let size = 10
      for (let i = 0; i < uidArr.length; i += size) {
        chunksArr.push(uidArr.slice(i, i + size));
      }
      setChunksArr(chunksArr)
      getArryPost(chunksArr)
    }
    const getRecommendPostsUid = async (userName,) => {
      const { token, id } = await generateToken()
      const getPosts = await fetch("/api/user/getRecommendPosts", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userName: userName, id })
      })
      const recommentPostUids = await getPosts.json()
      if (recommentPostUids.success) {
        getChunksArr(recommentPostUids.Posts)
      } else {
        toast({
          description: `❌ ${getPosts.message}`,
        })
      }
    }
    const checkAuthenticate = async () => {
      const req = await fetch("/api/account/checkSession", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify()
      })
      const res = await req.json()
      if (res.success) {
        getRecommendPostsUid(res.userDetails.userName)
      } else {
        router.push("/account/signup")
      }
    }
    checkAuthenticate()
  }, [])

  useEffect(() => {
    const processData = async () => {
      const processor = unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeDocument, { title: '👋🌍' })
        .use(rehypeFormat)
        .use(rehypeStringify)
        .use(rehypePrettyCode, {
          theme: "github-dark",
          transformers: [
            transformerCopyButton({
              visibility: 'always',
              feedbackDuration: 3_000,
            }),
          ],
        });
      const contentPromises = postArr.map(async (post) => {
        const content = (await processor.process(post.posts[0].description)).toString();
        return content;
      });
      const contents = await Promise.all(contentPromises);
      setHtmlContent((prevContent) => [...prevContent, ...contents]);
    };

    processData()
  }, [postArr])

  return (
    <div className="flex flex-col items-center">
      {postArr.length !== 0 && postArr.map((post, index) => {
        return (
          <div key={index} className="md:w-[80%] w-[90%] md:m-5 m-3 h-72 border overflow-hidden">
            <div className="my-3 mx-5">
              <button onClick={() => { router.push(`http://localhost:3000/post/${post.posts[0].uid}`) }} className="text-xl font-bold">
                {post.posts[0].title}
              </button>
              <div className="flex gap-2">
                <div>{post.posts[0].category}</div>
                <div className="border border-black"></div>
                <div className="flex gap-2">
                  <div><ThumbsUpIcon /></div>
                  <div>{(post.posts[0].likes).length}</div>
                </div>
              </div>
            </div>
            <div className="w-full md:m-5 m-3 md:h-[70%] h-[55%] overflow-auto">
              <div dangerouslySetInnerHTML={{ __html: htmlContent[index] }} className="prose dark:prose-invert"></div>
            </div>
          </div>
        )
      })}
      {postArr.length !== 0 && <Button variant="outline" onClick={() => { getArryPost(chunksArr) }}>Load more</Button>}
    </div>
  );
}
