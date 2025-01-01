"use client"
import { generateToken } from "@/func/generate_token"
import { useEffect, useState } from "react"
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import rehypePrettyCode from "rehype-pretty-code";
import { transformerCopyButton } from '@rehype-pretty/transformers'
import Link from "next/link"

const page = ({ params }) => {
  const [data, setData] = useState()
  const [htmlContent, setHtmlContent] = useState("")
  const [viewerData, setViewerData] = useState()

  const setViewer = async (userName, Uid, viewerUserName) => {
    console.log(userName, Uid, viewerUserName)
    const setThings = await fetch("/api/user/setViewer", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userName, Uid, viewerUserName })
    })
    const setThingsResponse = await setThings.json()
    console.log(setThingsResponse)
  }

  useEffect(() => {
    const getPost = async (viewerUserName) => {
      const uid = (await params).uid;
      const { token, id } = await generateToken()
      const req = await fetch("/api/user/findPost", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ uid, id })
      })
      const res = await req.json()
      if (res.success) {
        setViewer(res.data.userName, res.data.posts[0].uid, viewerUserName)
        setData(res.data)
      } else {
        alert("not done")
      }
    }
    const getViewetData = async () => {
      const req = await fetch("/api/account/checkSession", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify()
      })
      const res = await req.json()
      if (res.success) {
        setViewerData({ logged: true, userName: res?.userDetails?.userName })
        getPost(res?.userDetails?.userName)
      } else {
        setViewerData({ logged: false })
      }
    }
    getViewetData()
  }, [])

  function parseISOString(s) {
    if (data) {
      var b = s.split(/\D+/);
      return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6])).toString()
    }
  }
  useEffect(() => {
    if (data?.posts[0].description) {
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
          })
        const content = (await processor.process(data?.posts[0].description)).toString()
        console.log(content)
        setHtmlContent(content)
      }
      processData()
    }
  }, [data])


  const handleLikeorUnlike = async () => {
    if (data) {
      if (viewerData.logged) {
        const alreadyLiked = data.posts[0].likes.includes(viewerData.userName);
        const { token, id } = await generateToken()
        const req = await fetch("/api/other/likeOrUnlikePost", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ data, viewerUserName: viewerData.userName, alreadyLiked, id })
        })
        const res = await req.json()
        if (res.success) {
          window.location.reload()
        } else {
          alert(res.message)
        }
      } else {
        alert("Firstly log in")
      }
    }
  }

  return (
    <div className="max-w-6xl flex flex-col items-center mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">{data?.posts[0]?.title || " "}</h1>
      <div className="flex gap-2">
        <Link href={`http://localhost:3000/profile/${data?.userName}` || " "} className="text-sm text-gray-500 mb-4 italic">By {data?.userName || " "}</Link>
        <p className="text-sm text-gray-500 mb-4">{parseISOString(data?.createdAt) || " "}</p>
      </div>
      <button onClick={handleLikeorUnlike} className="flex gap-1 ">
        <span className="text-xl">{data?.posts[0]?.likes.length}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={data?.posts[0]?.likes?.includes(viewerData.userName) ? "0000" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thumbs-up"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" /></svg>
      </button>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="prose dark:prose-invert"></div>
    </div>
  )
}

export default page