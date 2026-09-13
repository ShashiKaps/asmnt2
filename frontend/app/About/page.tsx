export default function AboutPage() {
  return (
    <div className="bg-[var(--page-bg)] text-[var(--page-text)] p-8">
      <div className="max-w-5xl mx-auto flex gap-8">
        {/* Left: project description */}
        <div className="flex-1 border border-gray-600 rounded p-6 min-h-64">
          {/* Add your project description text here */}
          <p className="text-gray-300 leading-relaxed">
            This project is for Assessment 1, developing a web application using React and Next.js.
            The focus is on Frontend design and usability. </p>
            <p><br/> VS Code with Next.js and React form the basis of the application.   </p>
            <p> The use of AI coding tools was the Claude 4.6 model with GitHub Co-Pilot. All code is uploaded onto my GitHub student account.</p>
            <p> <br/> Research was done as per the links on the Home Page to understand what the Phonemes are about.
             Based on the research learning Phonemes are primarily for literacy education.</p>
            <p> <br/> When the player successfully completes the Wordle or WordSearch game, a simple message with a trophy is displayed. 
             This encourages a positive learning environment. </p>
            <p> <br/> I have made the Word search to only arrange letters in Left to Right, Left to Right Diagonal and Top to Bottom alignment.</p>
            <p> This will make it easier for learners to identify phonemes in words as this is the normal reading alignment.</p>

        </div>

        {/* Right: video embed */}
        <div className="flex-2 flex flex-col gap-3">
          <span className="text-gray-400">Video :</span>
          <div className="border border-gray-600 rounded overflow-hidden aspect-video bg-black">
            <video className="w-full h-full" controls>
              <source src="/Assessment1.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}
