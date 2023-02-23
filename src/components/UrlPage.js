import HistoryPicker from '@/components/HistoryPicker'

export default function UrlPage({
  history,
  onRemoveFromHistory,
  onFlushHistory,
  onUrlChange,
  className,
  children
}) {

  return (
    <section className={`${className}`}>
      <div className="container mx-auto">
        <div className={`top-part px-5 ${history.length ? 'pt-24' : ' pt-[35vh] lg:pt-[50vh]'}`}>
          <input
            className="placeholder-zinc-400 block mx-auto h-12 -mt-6 px-4 bg-zinc-800 w-full md:w-[450px] border border-zinc-100/20 text-zinc-400 text-lg rounded-none focus:text-white"
            type="text"
            placeholder="Paste your link here"
            onChange={e => onUrlChange(e.target.value)}
            autoFocus={true}
            inputMode="none"
          />
          <div
            className="text-center mt-2 text-zinc-500 text-sm"
          >
            Supported:
              Youtube,
              Twitch,
              SoundCloud,
              Mixcloud,
              Facebook,
              Vimeo,
              Dailymotion.
          </div>
        </div>
        <HistoryPicker
          className="mt-4"
          history={history}
          onRemoveItem={onRemoveFromHistory}
          onFlush={onFlushHistory}
          onUrlChange={onUrlChange}
        />
        {children}
      </div>
    </section>
  )
}
