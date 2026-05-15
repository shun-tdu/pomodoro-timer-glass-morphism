import { Dispatch, SetStateAction } from "react";

type ConfigPlaneProps = {
  name: string;
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
};

export function ConfigPlane({ name, value, setValue }: ConfigPlaneProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = parseInt(e.target.value, 10);

    if (isNaN(inputValue)) inputValue = 1;

    inputValue = Math.max(1, Math.min(60, inputValue));

    setValue(inputValue);
  };

  return (
    <div className="p-3 bg-white/10 text-white/10 rounded-md">
      <div className="flex flex-row items-center gap-1">
        <p className="text-white font-mono text-xl">{name} :</p>
        <input
          type="number"
          min={1}
          max={60}
          step={1}
          value={value}
          onChange={handleChange}
          className="text-xl text-white font-mono bg-transparent rounded p-1 text-center focus:outline-none focus:ring-2 focus:ring-white/50 "
        />
      </div>
    </div>
  );
}
