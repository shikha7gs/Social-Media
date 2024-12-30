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
  useEffect(() => {
    const getPost = async () => {
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
        console.log(res.data)
        setData(res.data)
      } else {
        alert("not done")
      }
    }
    getPost()
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
  return (
    <div className="max-w-6xl flex flex-col items-center mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">{data?.posts[0]?.title || " "}</h1>
      <div className="flex gap-2">
        <Link href={`http://localhost:3000/profile/${data?.userName}` || " "} className="text-sm text-gray-500 mb-4 italic">By {data?.userName || " "}</Link>
        <p className="text-sm text-gray-500 mb-4">{parseISOString(data?.createdAt) || " "}</p>
      </div>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="prose dark:prose-invert"></div>
    </div>
  )
}

export default page