import * as packageJson from "../../package.json"

export const AppFooter = () => {

  return (
    <>
      <img src="/images/icon.png" className="w-5 h-5" /><span className="ml-2 font-serif select-none text-sm text-gray-300">{packageJson.name}</span>
    </>
  )
}