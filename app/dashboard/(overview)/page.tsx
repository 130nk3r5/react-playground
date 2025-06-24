import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black p-8 font-mono">
      <h1 className="text-4xl text-green-400 font-bold mb-4">
        🟩 Minecraft CodeCraft: Student Hackathon 2025
      </h1>

      <div className="flex justify-center my-6">
        <Image src="/challenge/hackon.png" alt="Hackathon" width={450} height={450} />
      </div>

      <section className="space-y-4">
        <p className="text-xl font-semibold">🎮 <strong>Welcome to CodeCraft!</strong></p>
        <p>
          Are you ready to dig deep, craft clever solutions, and build your way to glory?  
          This student hackathon will test your logic, creativity, and problem-solving abilities – all wrapped in a <strong>Minecraft-themed adventure</strong>!
        </p>
      </section>

      <hr className="my-8 border-gray-600" />

      <section>
        <h2 className="text-2xl text-yellow-400 mb-2">⚙️ Rules</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Clone this repo, and create a folder with your name and surname: <br /><code>Hackathon/JohnDoe</code></li>
          <li>All code must be submitted at <strong>THE END</strong> of the hackathon in your own branch and a separate folder: <br /><code>Branch name: NameSurname</code></li>
          <li><strong>Absolutely NO</strong> AI is allowed. Not even Copilot.</li>
          <li>When you think you have the answer of Part 1, raise your hand. Judges will verify your answer.</li>
          <li>Once Part 1 is correct, you may proceed to Part 2.</li>
          <li>You can do the problems in any order.</li>
        </ul>
      </section>

      <hr className="my-8 border-gray-600" />

      <section>
        <h2 className="text-2xl text-pink-400 mb-2">🧱 Overview</h2>
        <p>
          The mines are deep. The mobs are restless. The Redstone circuits are on the fritz.  
          It&apos;s up to <strong>you</strong> to solve a series of programming puzzles scattered throughout the pixelated realm.
        </p>
        <p className="mt-2">
          🕹 Each challenge is a standalone coding problem, ranging from logic puzzles to string manipulation to simulation challenges – all Minecraft-themed to keep things fun and immersive!
        </p>
      </section>

      <hr className="my-8 border-gray-600" />

      <section>
        <h2 className="text-2xl text-blue-400 mb-2">📅 Schedule</h2>
        <table className="w-full text-left table-auto border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-2 border border-gray-700">Problem #</th>
              <th className="p-2 border border-gray-700">Event</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border border-gray-700"><a className="text-blue-600 underline hover:text-blue-800 cursor-pointer" href="/dashboard/challenge/1">Problem 1</a></td>
              <td className="p-2 border border-gray-700">Treasure Map Calibration</td>
            </tr>
            <tr>
              <td className="p-2 border border-gray-700"><a className="text-blue-600 underline hover:text-blue-800 cursor-pointer" href="/dashboard/challenge/2">Problem 2</a></td>
              <td className="p-2 border border-gray-700">Cube Conundrum</td>
            </tr>
            <tr>
              <td className="p-2 border border-gray-700"><a className="text-blue-600 underline hover:text-blue-800 cursor-pointer" href="/dashboard/challenge/3">Problem 3</a></td>
              <td className="p-2 border border-gray-700">Gear Ratios</td>
            </tr>
            <tr>
              <td className="p-2 border border-gray-700"><a className="text-blue-600 underline hover:text-blue-800 cursor-pointer" href="/dashboard/challenge/4">Problem 4</a></td>
              <td className="p-2 border border-gray-700">Scratchcards & Redeeming</td>
            </tr>
          </tbody>
        </table>
      </section>

      <hr className="my-8 border-gray-600" />

      <section>
        <h2 className="text-2xl text-teal-300 mb-2">🛠 What You'll Need</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Your coding skills ⚙️</li>
          <li>A language of your choice (Python, C#, JavaScript, etc.)</li>
          <li>A creative brain ready to <strong>mine for ideas</strong> and <strong>craft solutions</strong></li>
          <li>A GitHub account (to submit your code)</li>
        </ul>
      </section>

      <hr className="my-8 border-gray-600" />

      <section>
        <h2 className="text-2xl text-purple-300 mb-2">🧩 Challenge Structure</h2>
        <p>Each hour, a new Minecraft-themed problem will be done:</p>
        <ul className="list-disc ml-6 mt-2">
          <li><strong>Problem 1:</strong> Treasure Map Calibration – Extract calibration values.</li>
          <li><strong>Problem 2:</strong> Cube Conundrum – Skyblock Island puzzle from an Elf.</li>
          <li><strong>Problem 3:</strong> Gear Ratios – Decode Redstone contraption schematics.</li>
        </ul>
        <p className="mt-2">Each problem includes:</p>
        <ul className="list-disc ml-6">
          <li>A detailed story (Minecraft-themed)</li>
          <li>Input/output format</li>
          <li>Sample inputs</li>
        </ul>
      </section>

      <hr className="my-8 border-gray-600" />

      <section>
        <h2 className="text-2xl text-orange-300 mb-2">🧾 Submission Instructions</h2>
        <ol className="list-decimal ml-6 space-y-1">
          <li>Fork this repo 📦</li>
          <li>Create a folder for yourself</li>
          <li>Submit a solution file for each problem (e.g. <code>problem_1_solution.py</code>)</li>
          <li>Include a <code>README.md</code> inside your folder</li>
          <li>Push to your fork and submit a PR before the deadline</li>
        </ol>
      </section>

      <hr className="my-8 border-gray-600" />

      <section>
        <h2 className="text-2xl text-green-300 mb-2">🏆 Scoring</h2>
        <ul className="list-disc ml-6">
          <li>✅ Correctness: 60%</li>
          <li>⚡️ Efficiency: 20%</li>
          <li>✨ Creativity / Code style: 20%</li>
        </ul>
        <p className="mt-2">Bonus points for:</p>
        <ul className="list-disc ml-6">
          <li>Clean code</li>
          <li>Readable comments</li>
          <li>Fun variable names (e.g. <code>creeperCount</code>, <code>diamondStacks</code>)</li>
        </ul>
      </section>

      <hr className="my-8 border-gray-600" />

      <section>
        <h2 className="text-2xl text-pink-300 mb-2">🧑‍💻 Who Can Participate?</h2>
        <ul className="list-disc ml-6">
          <li>Students only (high school or university)</li>
          <li>Solo players only</li>
          <li>Must love Minecraft… or at least pretend to 😄</li>
        </ul>
      </section>

      <hr className="my-8 border-gray-600" />

      <section>
        <h2 className="text-2xl text-yellow-300 mb-2">🎁 Prizes</h2>
        <p>Eternal glory in the Hall of Fame (aka this repo)</p>
      </section>

      <hr className="my-8 border-gray-600" />

      <section>
        <h2 className="text-2xl text-cyan-300 mb-2">📣 Tips for Success</h2>
        <ul className="list-disc ml-6">
          <li>Think before you code: understand the problem first!</li>
          <li>Test your code with sample and edge cases</li>
          <li>Use Git early and often</li>
          <li>Have fun! This is your time to <strong>craft code like a pro</strong> 🧠🪓</li>
        </ul>
      </section>

      <hr className="my-8 border-gray-600" />

      <section>
        <h2 className="text-2xl text-white mb-2">📫 Need Help?</h2>
        <p><em><strong>Talk to a senior</strong></em></p>

        <p className="mt-4 text-green-400">
          Let the best miner win. <br />
          <strong>Hack the block. Craft the win.</strong>
        </p>

        <p className="mt-4 text-yellow-300 text-xl">🟨🟩🟦 Good luck, CodeCrafters! 🟦🟩🟨</p>
      </section>
    </main>
  );
}
