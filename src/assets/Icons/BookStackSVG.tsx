type Props = {
    fill?: string,
    stroke?: string,
    size?: string,
    className?: string,
}

const BookStackSVG = ({ fill = "currentColor", stroke = "currentColor", size = "100", className = "" }: Props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={fill}
            stroke={stroke}
            width={size}
            height={size}
            className={className}
            strokeWidth="0"
            viewBox="0 0 256 256"
        >
            <path d="M231.65 194.55l-33.19-157.8a16 16 0 00-19-12.39l-46.81 10.06a16.08 16.08 0 00-12.3 19l33.19 157.8A16 16 0 00169.16 224a16.25 16.25 0 003.38-.36l46.81-10.06a16.09 16.09 0 0012.3-19.03zM136 50.15v-.09l46.8-10 3.33 15.87L139.33 66zm6.62 31.47l46.82-10.05 3.34 15.9L146 97.53zm6.64 31.57l46.82-10.06 13.3 63.24-46.82 10.06zM216 197.94l-46.8 10-3.33-15.87 46.8-10.07 3.33 15.85v.09zM104 32H56a16 16 0 00-16 16v160a16 16 0 0016 16h48a16 16 0 0016-16V48a16 16 0 00-16-16zM56 48h48v16H56zm0 32h48v96H56zm48 128H56v-16h48v16z"></path>
        </svg>
    )
}

export default BookStackSVG