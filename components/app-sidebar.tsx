import { CircleCheckBig, Home, MoveUpRight } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const topitems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "TODO",
    url: "/todo",
    icon: CircleCheckBig,
  },
  // {
  //   title: "Account",
  //   url: "/account",
  //   icon: User,
  // },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tidy.io</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {topitems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <a href="https://github.com/aaa-cloud-05/TODO-app_with_supabase_nextjs" target="_blank">
              <MoveUpRight/>
              <span>Dev Info</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  )
}