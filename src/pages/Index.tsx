import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { AnimatedTransition, FadeInStagger } from "@/components/AnimatedTransition";
import Button from "@/components/ui-custom/Button";
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui-custom/Card";
import { PencilLine, Palette, Printer, Crown, Image, Settings, Heart, Users, SparkleIcon } from "lucide-react";
import { motion } from "framer-motion";
const Index = () => {
  const navigate = useNavigate();
  return <Layout>
      <AnimatedTransition>
        <section className="relative py-12 md:py-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-king-200 rounded-full blur-3xl opacity-20 -z-10"></div>
          
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1]
          }} className="inline-flex items-center gap-2 bg-king-50 text-king-800 rounded-full px-4 py-1.5 text-sm font-medium">
              <Crown size={14} />
              <span>Custom Coloring Pages, Instantly</span>
            </motion.div>
            
            <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1]
          }}>
              The <span className="text-king-600">Color King</span><br />
              at Your Fingertips
            </motion.h1>
            
            <motion.p className="text-xl text-muted-foreground max-w-2xl mx-auto" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1]
          }}>
              Create custom coloring pages in seconds. Describe what you want, 
              choose from options, and print your perfect coloring page. 
            </motion.p>
            
            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center mt-8" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1]
          }}>
              <Button variant="premium" size="lg" onClick={() => navigate("/create")} icon={<PencilLine size={18} />} className="px-8">
                Create Now
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </motion.div>
          </div>
        </section>
        
        <section className="py-20 relative">
          <div className="absolute top-1/2 left-0 w-full h-[500px] bg-king-50 -z-10 transform -translate-y-1/2 skew-y-3"></div>
          
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block bg-king-100 text-king-800 rounded-full px-3 py-1 text-sm font-medium mb-4">
                How It Works
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Create Your Perfect Coloring Page in 4 Simple Steps
              </h2>
              <p className="text-muted-foreground">
                Our intuitive process makes it easy to go from idea to printed coloring page in minutes
              </p>
            </div>
            
            <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[{
              title: "Describe",
              description: "Tell us what you want to color",
              icon: <PencilLine className="h-6 w-6 text-king-600" />,
              step: "01"
            }, {
              title: "Choose",
              description: "Select from generated options",
              icon: <Image className="h-6 w-6 text-king-600" />,
              step: "02"
            }, {
              title: "Customize",
              description: "Adjust size, outlines, and more",
              icon: <Settings className="h-6 w-6 text-king-600" />,
              step: "03"
            }, {
              title: "Print",
              description: "Send to your printer and enjoy",
              icon: <Printer className="h-6 w-6 text-king-600" />,
              step: "04"
            }].map((item, index) => <Card key={index} className="relative overflow-visible">
                  <CardContent className="pt-8 pb-6">
                    <div className="absolute -top-6 left-6 bg-king-600 text-white h-12 w-12 rounded-xl flex items-center justify-center shadow-lg">
                      {item.icon}
                    </div>
                    <div className="absolute top-3 right-3 text-king-200 font-display text-4xl font-bold opacity-70">
                      {item.step}
                    </div>
                    <div className="pt-6">
                      <h3 className="text-xl font-display font-bold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>)}
            </FadeInStagger>
            
            <div className="text-center mt-12">
              <Button variant="premium" size="lg" onClick={() => navigate("/create")} icon={<Crown size={18} />}>
                Start Creating
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block bg-king-100 text-king-800 rounded-full px-3 py-1 text-sm font-medium mb-4">
                Made For Everyone
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Perfect For All Ages and Occasions
              </h2>
              <p className="text-muted-foreground">
                Create customized coloring pages for any purpose or audience
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              <Card className="glass-dark text-white bg-gradient-to-br from-king-800 to-king-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-king-300" />
                    For Parents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-king-100 mb-4">
                    Create personalized coloring pages tailored to your child's interests:
                  </p>
                  <ul className="space-y-2 text-sm text-king-200">
                    <li className="flex items-start gap-2">
                      <SparkleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Incorporate your child's favorite characters and hobbies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <SparkleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Create custom themes for birthdays and special events</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <SparkleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Save money on store-bought coloring books</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="glass-dark text-white bg-gradient-to-br from-king-700 to-king-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-king-300" />
                    For Educators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-king-100 mb-4">
                    Create educational and engaging content for your classroom:
                  </p>
                  <ul className="space-y-2 text-sm text-king-200">
                    <li className="flex items-start gap-2">
                      <SparkleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Design pages that complement your lesson plans</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <SparkleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Create custom activities for different age groups</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <SparkleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Generate unique rewards for student achievements</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="glass-dark text-white bg-gradient-to-br from-king-600 to-king-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-king-300" />
                    For Teens & Adults
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-king-100 mb-4">
                    Explore your creativity with personalized coloring:
                  </p>
                  <ul className="space-y-2 text-sm text-king-200">
                    <li className="flex items-start gap-2">
                      <SparkleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Create detailed designs based on your interests</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <SparkleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Generate stress-relieving patterns and mandalas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <SparkleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Design unique art for crafts and projects</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <section className="py-20">
          <div className="max-w-3xl mx-auto text-center px-4">
            <div className="inline-block bg-king-100 text-king-800 rounded-full px-3 py-1 text-sm font-medium mb-4">
              Ready To Start?
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Create Your First Coloring Page Today
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Join thousands of parents, teachers, and coloring enthusiasts who are creating 
              custom coloring pages with King of Colors.
            </p>
            
            <Button variant="premium" size="lg" onClick={() => navigate("/create")} className="px-8">
              Get Started for Free
            </Button>
          </div>
        </section>
      </AnimatedTransition>
    </Layout>;
};
export default Index;