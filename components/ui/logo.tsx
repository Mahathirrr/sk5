export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 300 300"
        className="text-white"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#4A90E2" }} />
            <stop offset="100%" style={{ stopColor: "#5D3FD3" }} />
          </linearGradient>
        </defs>

        {/* Background Circle */}
        <circle cx="150" cy="150" r="140" fill="url(#logoGradient)" />

        {/* Abstract Learning Icon */}
        <path
          d="M100 120 
             Q150 80, 200 120 
             Q150 160, 100 120 
             Z"
          fill="white"
          stroke="white"
          strokeWidth="10"
        />

        {/* Brain/Knowledge Stylized Shape */}
        <path
          d="M120 180 
             Q150 210, 180 180 
             Q210 150, 180 120 
             Q150 90, 120 180 
             Z"
          fill="white"
          opacity="0.7"
        />
      </svg>
      <span className="text-xl font-sans font-semibold text-white">
        Skill<span className="text-white">opa</span>
      </span>
    </div>
  );
}

