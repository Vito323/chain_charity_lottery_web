import Header from "@/components/header"
import PageTitle from "@/components/page-title"
import Footer from "@/components/footer"
import Scrollbar from "@/components/scrollbar"
import UserCenter from "./content"



const UserPage = () => {
  return (
    <>
        <Header />
        {/* <PageTitle pageTitle={"User Center"} pagesub={"User Center"} /> */}
        <UserCenter />
        <Footer />
        <Scrollbar />
    </>

  )
}


export default UserPage;