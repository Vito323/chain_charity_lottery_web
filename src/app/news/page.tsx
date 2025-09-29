import BlogList from "@/components/blog-list";
import Footer from "@/components/footer";
import Header from "@/components/header";
import PageTitle from "@/components/page-title";
import Scrollbar from "@/components/scrollbar";



const BlogPage =() => {
  return(
      <>
          <Header/>
          <PageTitle pageTitle={'Latest News'} pagesub={'Blog'}/> 
          <BlogList/>
          <Footer/>
          <Scrollbar/>
      </>
  )
};
export default BlogPage;