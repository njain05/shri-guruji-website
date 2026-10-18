import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container-page py-28 text-center">
      <h1 className="font-display font-normal text-[2.8rem]">This page isn't here</h1>
      <p className="text-muted text-lg mt-2">The link may be old, or there may be a typo in the address.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/products" className="button-primary">Go to the shop</Link>
        <Link to="/" className="button-quiet">Back to home</Link>
      </div>
    </div>
  )
}
