export function getMainCyclePagePath(): string {
    const mode = localStorage.getItem('systemMode')

    if (mode === 'offline') return '/offline'
    if (mode === 'waiting') return '/disabled'
    if (mode === 'open') return '/teams'

    const now = new Date()
    const dow = now.getDay()
    if (dow === 0 || dow === 6) return '/offline'

    const minutes = now.getHours() * 60 + now.getMinutes()
    const h1430 = 14 * 60 + 30
    const h1500 = 15 * 60
    const h1540 = 15 * 60 + 40
    const h2030 = 20 * 60 + 30
    const h2100 = 21 * 60
    const h2140 = 21 * 60 + 40

    if (minutes >= h1430 && minutes < h1500) return '/teams'
    if (minutes >= h1500 && minutes < h1540) return '/matches'
    if (minutes >= h2030 && minutes < h2100) return '/teams'
    if (minutes >= h2100 && minutes < h2140) return '/matches'

    return '/disabled'
}
