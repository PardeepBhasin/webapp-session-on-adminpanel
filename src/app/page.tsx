import LeftPanel from "@/components/LeftPanel";
import UserInfo from "@/components/UserInfo";

export default function Home() {
  return (
    <div className="grid grid-flow-col h-screen">
      <div className=" col-span-1">
        <LeftPanel />
      </div>
      <div className="col-span-4  bg-green-400">
        <UserInfo />
      </div>
    </div>
  )
}
