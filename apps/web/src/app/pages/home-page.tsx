import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SquashBallMark } from '../components/squash-ball-mark';

const courtSlots = [
  { time: '06:30', label: 'First serve', status: 'Open courts' },
  { time: '12:15', label: 'Lunch ladder', status: 'Fast 45-min blocks' },
  { time: '19:40', label: 'Prime time', status: 'League-ready' },
];

export function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,_#f7f1e7_0%,_#efe5d1_52%,_#d7e0c8_100%)] text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SquashBallMark />
            <div>
              <p className="font-heading text-2xl font-bold tracking-[-0.04em] text-slate-950">Courtlane</p>
              <p className="text-sm text-slate-700">Squash court reservations</p>
            </div>
          </div>

          <nav className="flex items-center gap-2 sm:gap-3">
            <Button
              className="border-border bg-background/70 text-foreground shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:bg-background"
              size="sm"
              variant="outline"
            >
              <Link to="/login">Log in</Link>
            </Button>
            <Button
              className="border-border bg-background/70 text-foreground shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:bg-background"
              size="sm"
              variant="outline"
            >
              <Link to="/signup">Sign up</Link>
            </Button>
          </nav>
        </header>

        <section className="relative mt-10 grid flex-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="relative">
            <div className="absolute -left-12 top-6 hidden h-40 w-40 rounded-full bg-lime-300/35 blur-3xl lg:block" />
            <div className="absolute bottom-0 right-8 hidden h-56 w-56 rounded-full bg-amber-300/35 blur-3xl lg:block" />

            <div className="relative max-w-2xl">
              <p className="mb-4 inline-flex rounded-full border border-white/70 bg-white/55 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-950/80 backdrop-blur-sm">
                Built for fast club booking
              </p>
              <h1 className="font-heading text-5xl font-bold leading-[0.95] tracking-[-0.06em] text-balance sm:text-6xl lg:text-7xl">
                Reserve the right court before the rally starts.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700 sm:text-xl">
                Courtlane keeps weekly squash bookings clear, quick, and competitive. Scan open slots, lock in your
                court, and keep your club calendar moving.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="border-border bg-background/70 text-foreground shadow-[0_12px_28px_rgba(15,23,42,0.08)] hover:bg-background"
                  size="lg"
                  variant="outline"
                >
                  <Link to="/signup">Create an account</Link>
                </Button>
                <Button
                  asChild
                  className="border-border bg-background/70 text-foreground shadow-[0_12px_28px_rgba(15,23,42,0.08)] hover:bg-background"
                  size="lg"
                  variant="outline"
                >
                  <Link to="/login">I already have access</Link>
                </Button>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/65 bg-white/65 p-4 backdrop-blur-sm">
                  <p className="text-3xl font-bold tracking-[-0.05em] text-slate-950">24/7</p>
                  <p className="mt-1 text-sm text-slate-600">Booking visibility across the full week</p>
                </div>
                <div className="rounded-3xl border border-white/65 bg-white/65 p-4 backdrop-blur-sm">
                  <p className="text-3xl font-bold tracking-[-0.05em] text-slate-950">4</p>
                  <p className="mt-1 text-sm text-slate-600">Courts tracked side by side in one view</p>
                </div>
                <div className="rounded-3xl border border-white/65 bg-white/65 p-4 backdrop-blur-sm">
                  <p className="text-3xl font-bold tracking-[-0.05em] text-slate-950">1 tap</p>
                  <p className="mt-1 text-sm text-slate-600">From open slot to confirmed reservation</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-8 top-8 h-24 rounded-full bg-emerald-900/15 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,_rgba(18,52,40,0.95)_0%,_rgba(13,32,27,0.98)_100%)] p-5 text-white shadow-[0_30px_80px_rgba(22,34,27,0.28)] sm:p-6">
              <div className="rounded-[1.6rem] border border-white/10 bg-white/6 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300/80">
                      Tonight at the club
                    </p>
                    <h2 className="mt-2 font-heading text-3xl font-bold tracking-[-0.05em]">Squash board</h2>
                  </div>
                  <div className="rounded-full border border-lime-300/30 bg-lime-300/12 px-3 py-1 text-xs font-semibold text-lime-200">
                    Live availability
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#f6edd7] p-3 text-slate-950">
                  <div className="grid grid-cols-[88px_repeat(4,minmax(0,1fr))] gap-2 text-center text-[0.72rem] font-bold uppercase tracking-[0.18em] text-slate-500">
                    <span className="text-left">Time</span>
                    <span>Court 1</span>
                    <span>Court 2</span>
                    <span>Court 3</span>
                    <span>Court 4</span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {courtSlots.map((slot, index) => (
                      <div key={slot.time} className="grid grid-cols-[88px_repeat(4,minmax(0,1fr))] gap-2">
                        <div className="rounded-2xl bg-slate-900 px-3 py-3 text-left text-white">
                          <p className="text-sm font-bold">{slot.time}</p>
                          <p className="mt-1 text-[0.68rem] uppercase tracking-[0.15em] text-white/65">{slot.label}</p>
                        </div>
                        {Array.from({ length: 4 }).map((_, courtIndex) => {
                          const isOpen = (index + courtIndex) % 3 !== 0;

                          return (
                            <div
                              key={`${slot.time}-${courtIndex}`}
                              className={
                                isOpen
                                  ? 'rounded-2xl border border-emerald-800/10 bg-emerald-100 px-3 py-3'
                                  : 'rounded-2xl border border-amber-900/10 bg-amber-100 px-3 py-3'
                              }
                            >
                              <p className="text-sm font-semibold">{isOpen ? 'Open' : 'Booked'}</p>
                              <p className="mt-1 text-[0.68rem] uppercase tracking-[0.14em] text-slate-600">
                                {isOpen ? slot.status : 'Club match'}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300/80">Weekly rhythm</p>
                    <p className="mt-2 text-sm leading-6 text-white/72">
                      Peak evening windows stand out immediately, so players can book before league nights compress the
                      board.
                    </p>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300/80">Court control</p>
                    <p className="mt-2 text-sm leading-6 text-white/72">
                      Keep reservations readable for members, coaches, and front desk staff without spreadsheet drift.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
