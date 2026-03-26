import Button from "@/components/_ui/Button";
import { Card, CardContent } from "@/components/_ui/Card";
import Falcon from "@/components/_ui/icons/Falcon";
import LogoFHO from "@/components/_ui/icons/FHO";
import { Trophy, Calendar, BookOpen } from "lucide-react";
import styles from "./home.module.scss";

const Home = () => {
  return (
    <div className={`${styles.homeContainer}`}>
      <header className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="w-12 h-12 sm:w-16 md:w-20 sm:h-16 md:h-20 flex items-center justify-center">
              <LogoFHO className="h-10 sm:h-14 md:h-16 w-auto" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Falcon</h1>
              <p className="text-xs sm:text-sm text-white/90">Sistema Educacional</p>
            </div>
          </div>
          <div className="flex items-center">
            <Button
              size="lg"
              variant="ghost"
              type="link"
              linkHref="/login"
              rounded
              className="border-2 border-white !text-white bg-transparent hover:!text-slate-800 text-sm sm:text-base"
            >
              Login
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-12 sm:mb-16">
          <div className="mb-6 sm:mb-8">
            <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
              <Falcon className="w-full h-full" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 px-2">
            Falcon - Maratona de Programação
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Plataforma oficial da Maratona de Programação realizada pela
            Fundação Hermínio Ometto
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button
              size="lg"
              className="bg-white text-[#4F85A6] font-semibold w-full sm:w-auto"
              type="link"
              rounded
              linkHref="/profile"
            >
              Acessar Sistema
            </Button>

            <Button
              size="lg"
              variant="outline"
              rounded
              className="border-2 !border-white !text-white bg-transparent w-full sm:w-auto"
            >
              Notícias Acadêmicas
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 px-2">
          <Card className="bg-white/20 border-white/30 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6 text-center">
              <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-white mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                Competições
              </h3>
              <p className="text-xs sm:text-sm text-white">
                Acompanhe maratonas e competições de programação
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/20 border-white/30 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6 text-center">
              <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-white mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                Cronograma
              </h3>
              <p className="text-xs sm:text-sm text-white">
                Visualize datas importantes e prazos de inscrição
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/20 border-white/30 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-6 text-center">
              <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-white mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                Recursos
              </h3>
              <p className="text-xs sm:text-sm text-white">
                Acesse materiais e recursos para preparação
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center px-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            Pronto para Participar?
          </h3>
          <p className="text-sm sm:text-base text-white mb-6 sm:mb-8 max-w-xl mx-auto">
            Junte-se à nossa comunidade de programadores e participe das
            próximas competições.
          </p>
          <div className="flex justify-center">
            <Button
              size="lg"
              className="bg-white text-[#4F85A6] font-semibold"
              rounded
              type="link"
              linkHref="/register"
            >
              Criar Conta Agora
            </Button>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-6 py-8 mt-16 border-t border-white/30">
        <div className="text-center text-white">
          <p>
            &copy; 2025 Falcon - Sistema de Maratona de Programação. Todos os
            direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
