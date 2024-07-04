"use client";

type ScheduleItemProps = {
  title: string;
  time: string;
  id: string;
  handleRemove: (id: string) => void;
};

function ScheduleItem(props: ScheduleItemProps) {
  const { title, time, id, handleRemove } = props;

  return (
    <li key={id} className="flex gap-2">
      <div>
        <span className="font-bold">{time}</span> – {title}
      </div>
      <button onClick={() => handleRemove(id)} className="text-red-500">
        Usuń
      </button>
    </li>
  );
}

export default ScheduleItem;
