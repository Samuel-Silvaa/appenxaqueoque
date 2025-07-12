import React, { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import AppPageScaffold from '../../shared/components/appPageScaffold/AppPageScaffold';
import { useDispatch } from 'react-redux';
import { setPageTitle } from 'src/infra/app/reducers/app.reducer';

const Terms = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(setPageTitle('Termos'));
    }, 200);
  }, []);

  return (
    <AppPageScaffold>
      <ScrollView
        contentContainerStyle={{ padding: 18 }}
        className='rounded-[30px] bg-white dark:bg-[#3F467ADF]'
      >
        <Text className='text-sm text-[#ADB8D3]'>
          {`
1. Introdução
 
Bem-vindo ao aplicativo móvel para auxiliar no diagnóstico e no tratamento da cefaleia infantil, desenvolvido pela discente Bruna Borges Silva e orientadora Jaqueline Jóice Muniz, no âmbito do Mestrado Profissional em Ciências Aplicadas à Saúde da Universidade do Vale do Sapucaí (UNIVÁS), pertencente a Fundação do Vale do Sapucaí; dedicada a fornecer soluções inovadoras na área da saúde. Estes Termos e Condições de Uso ("Termos de Uso") regem o uso do Aplicativo, sites, softwares e serviços relacionados. Ao acessar ou utilizar o aplicativo, você concorda em cumprir e ficar vinculado a estes Termos.
Os presentes Termos expõem a forma de utilização e as boas práticas de interação dos usuários com o aplicativo e com a controladora, a fim de preservar um ambiente confiável de navegação. Temos compromisso com a segurança dos usuários, portanto você só deve usar o aplicativo caso concorde com nossos termos.
Ao registrar-se no aplicativo você declara ser maior de 18 (dezoito) anos e concorda em seguir os presentes termos em seu nome ou em nome de qualquer outra pessoa por você autorizada. Caso seja menor de 18 (dezoito) anos, declara estar amparado por pai ou responsável.
 
2. Objeto do Contrato
 
O aplicativo é um diário virtual de episódios de dor, o qual viabiliza a coleta e o tratamento de informações de crianças com queixas de cefaleia fornecendo a elas mecanismos lúdicos com os quais possam, por identificação, expressar adequadamente seus sintomas.
O aplicativo foi projetado para utilização de crianças conjuntamente a seus pais ou responsáveis. Os pais e responsáveis comprometem-se a guiar, auxiliar e cooperar com as crianças queixosas de cefaleia durante a interação com o aplicativo.
A finalidade do aplicativo é munir o profissional médico com dados e relatórios úteis ao diagnóstico e tratamento da cefaleia infantil; superar as limitações naturais de comunicação dos pacientes infantis em sua faixa etária; e otimizar a comunicação entre médicos, pacientes e familiares, visando a avanços científicos e estatísticos.
Dessa forma, o aplicativo não realiza o diagnóstico, apenas coleta e trata informações necessárias para que um profissional médico possa efetivamente diagnosticar e tratar a doença.
 
3. Responsabilidades e Limitações
 
Os pais e responsáveis devem auxiliar a criança a preencher informações verdadeiras. No momento do registro no aplicativo, cada usuário recebe um código de identificação (ID) interno. Sempre que o usuário acessar o aplicativo, suas ações serão registradas internamente com esse ID.
Os pais e responsáveis devem ainda proteger suas senhas de acesso, podendo alterá-la sempre que necessário. Oportunamente, deverão ainda se valer de ferramentas de segurança complementar como autenticação de dois fatores caso sejam disponibilizadas pelo aplicativo.
Também concordam em não revelar ou divulgar qualquer informação confidencial do aplicativo, o que inclui informações não públicas relacionadas ao software, documentação ou informações relacionadas a preços, descontos, este contrato, erros no Software e outros dados competitivos ou proprietários (ou seja, informações comerciais, técnicas ou financeiras) ou informações que uma pessoa razoável concluiria serem confidenciais, sem o acordo por escrito controladora do aplicativo.
A controladora do aplicativo não garante disponibilidade contínua do aplicativo, o qual é passível de interrupções por caso fortuito ou força maior. Além disso, a controladora também não se responsabiliza por danos decorrentes do mau uso do aplicativo, nem sobre conteúdos de terceiros acessados através do aplicativo.
Caso seja necessário, o usuário pode solicitar suporte técnico através dos meios de comunicação indicados ao final deste contrato.
O usuário também é responsável por ler e concordar com as nossas Políticas de Privacidade, que complementam integralmente os presentes Termos de Uso.
 
4. Uso e Licença
 
A controladora do aplicativo concede ao usuário uma licença limitada, não exclusiva e não transferível para uso pessoal do aplicativo. Todos os direitos associados permanecem de propriedade da controladora e o usuário não adquire direitos de propriedade do aplicativo pelo seu uso.
O usuário não pode modificar, adaptar ou criar obras derivadas do Aplicativo, realizar engenharia reversa, descompilar ou desmontar o Aplicativo, remover ou alterar avisos de propriedade, usar o Aplicativo para fins ilegais ou não autorizados. A controladora do aplicativo pode atualizar ou modificar o aplicativo a qualquer momento, sem aviso prévio.
A licença termina automaticamente se o usuário violar estes Termos, sendo que o usuário deve cessar o uso e excluir o Aplicativo imediatamente após a rescisão.
O usuário cede o uso de seus comentários ou sugestões para fins de avaliação interna e, eventualmente, publicidade.
 
5. Alterações nos Termos e Condições
 
Esses Termos de Uso podem mudar a qualquer momento e a utilização dos nossos serviços será considerada concordância tácita das alterações, portanto é responsabilidade do usuário revisá-los constantemente. Ainda assim, sempre utilizaremos nossos canais de comunicação para dar publicidade sobre tais mudanças.
 
6. Disposições Gerais
 
Estes Termos são o acordo integral entre o usuário e a controladora do aplicativo, substituindo todos os acordos anteriores. A falta de exigência de cumprimento de qualquer termo não implica renúncia futura.
O usuário não pode transferir seus direitos e obrigações sem consentimento, mesmo que a controladora do aplicativo possa transferir os seus livremente. Se qualquer termo for invalidado, os demais permanecerão em vigor.
A controladora do aplicativo pode modificar os Termos a qualquer momento, sendo responsabilidade do usuário atualizar-se constantemente das eventuais alterações, sendo que o uso contínuo do aplicativo após mudanças implicará aceitação contratual
Eventuais disputas serão resolvidas no foro de Pouso Alegre/MG.
 
7. Como entrar em contato conosco
 
Para dúvidas ou solicitações relacionadas a esses Termos de Uso, por gentileza entrar em contato conosco pelo e-mail enxaqueoque@gmail.com ou pelo telefone (35) 99806-0109.`}
        </Text>
      </ScrollView>
    </AppPageScaffold>
  );
};

export default Terms;
