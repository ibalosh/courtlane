export function SquashBallMark() {
  return (
    <div className="relative flex size-13 shrink-0 items-center justify-center">
      <div className="absolute inset-[0.2rem] -rotate-[24deg] rounded-full bg-[#171717] shadow-[0_10px_20px_rgba(15,23,42,0.5)]" />
      <span className="absolute left-[1rem] top-[1.46rem] size-1.5 rounded-full bg-[#ffd84d] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]" />
      <span className="absolute left-[1.38rem] top-[1.1rem] size-1.5 rounded-full bg-[#ffd84d] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]" />
    </div>
  );
}
