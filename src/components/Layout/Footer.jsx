export default function Footer() {
  return (
    <footer className="bg-easia-gray-900 text-easia-gray-300 text-sm">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <span className="font-bold text-white">easia</span>
          <span className="text-easia-gray-300 text-xs ml-1 italic">travel</span>
          <span className="ml-2 text-easia-gray-500">|</span>
          <span className="ml-2 text-easia-gray-500">We make Asia Easy for You</span>
        </div>
        <div className="flex gap-6 text-easia-gray-500 text-xs">
          <span>Vietnam</span>
          <span>Thailand</span>
          <span>Cambodia</span>
          <span>Laos</span>
          <span>Japan</span>
        </div>
        <div className="text-easia-gray-500 text-xs">
          Easia Hub Mockup MVP — Project JARVIS
        </div>
      </div>
    </footer>
  );
}
