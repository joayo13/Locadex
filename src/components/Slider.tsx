
interface SliderProps {
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (value: number) => void;
    label?: string;
}

const Slider: React.FC<SliderProps> = ({ value, min, max, step = 1, onChange, label }) => {
    return (
        <div className="slider-container">
            {label && <label className="block mb-2">{label}: {value} m</label>}
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="slider w-44"
            />
        </div>
    );
};

export default Slider;