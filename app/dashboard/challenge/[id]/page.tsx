import { fetchChallengeById } from "@/app/lib/data";
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import React from "react";
import { Challenge } from "@/app/lib/definitions";
import InputSection from "@/app/ui/challenge/input-section";
import AnswerForm from "@/app/ui/challenge/answer-form";
import AllScoresPage from "../../all-scores/page";


export const metadata: Metadata = {
  title: 'Challenge Details',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const challengeId = params.id;
  const isEnd = params.id.endsWith('end');
  let challenge: Challenge | null = null;
  if (!isEnd) {
    challenge = await fetchChallengeById(challengeId);
  }

  return (
    <main>
      {challenge?.challenge ? (
        <>
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {challenge.challenge}
          </ReactMarkdown>
          {/* --- Answer Form goes here --- */}
          <AnswerForm challengeId={challengeId} />
          {challenge.input && <InputSection input={challenge.input} />}
        </>
      ) : (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <AllScoresPage />
        </div>
      )}
    </main>
  );
}