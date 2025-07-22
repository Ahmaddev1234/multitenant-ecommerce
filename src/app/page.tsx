import Image from "next/image";
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
export default function Home() {
  return (
    <div className="flex flex-col gap-y-4">
      <div >
        <Button variant="elevated">
          Hello
        </Button>
      </div>  
      <div >
        <Input placeholder="Hello i am input"/>
      </div> 
      <div >
        <Progress value={50}/>
      </div> 
      <div >
        <Checkbox/>
      </div> 
      <div >
        <Textarea placeholder="Hello i am text area"/>
      </div>
    </div>
  )
}
