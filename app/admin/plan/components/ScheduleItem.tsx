"use client";

import { DeleteOutlineRounded } from "@mui/icons-material";

type ScheduleItemProps = {
  title: string;
  time: string;
  id: string;
  handleRemove: (id: string) => void;
};

function ScheduleItem(props: ScheduleItemProps) {
  const { title, time, id, handleRemove } = props;

  return (
    <li
      key={id}
      className="flex gap-2 justify-between px-4 items-center bg-gray-100 py-2 shadow-arround rounded-xl transition duration-200 hover:bg-gray-200"
    >
      <div>
        <span className="font-bold">{time}</span> – {title}
      </div>
      <button
        onClick={() => handleRemove(id)}
        className="text-sm md:text-base text-red-600 bg-gray-100 shadow-arround hover:bg-red-500 hover:text-white bg-opacity-50 hover:bg-opacity-85 transition duration-200 p-2 rounded-full"
      >
        <DeleteOutlineRounded />
      </button>
    </li>
  );
}

export default ScheduleItem;
