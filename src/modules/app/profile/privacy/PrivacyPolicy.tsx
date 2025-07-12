import React, { useEffect } from 'react';
import { ScrollView, Text,  } from 'react-native';
import AppPageScaffold from '../../shared/components/appPageScaffold/AppPageScaffold';
import { useDispatch } from "react-redux";
import { setPageTitle } from "src/infra/app/reducers/app.reducer";

const PrivacyPolicy = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(setPageTitle('Política de privacidade'));
    }, 200);
  }, []);

  return (
    <AppPageScaffold >
      <ScrollView contentContainerStyle={{ padding: 18 }} className="rounded-[30px] bg-white dark:bg-[#3F467ADF]">
        <Text className="text-sm text-[#ADB8D3]" >
          {`
1. Introdução
 
Bem-vindo(a) ao aplicativo móvel para auxiliar no diagnóstico e no tratamento da cefaleia infantil, desenvolvido pela discente Bruna Borges Silva e orientadora Jaqueline Jóice Muniz, no âmbito do Mestrado Profissional em Ciências Aplicadas à Saúde da Universidade do Vale do Sapucaí (UNIVÁS), pertencente a Fundação do Vale do Sapucaí; dedicada a fornecer soluções inovadoras na área da saúde.
Sua privacidade é importante para nós, por isso, observamos a LGPD no tratamento de seus dados. Ao acessar ou utilizar o aplicativo, você concorda em cumprir e ficar vinculado a estas Políticas de Privacidade. Nesse tratamento respeitamos o anonimato do usuário do aplicativo em relação aos seus dados sensíveis para coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração de seus dados. Essa Política de Privacidade e Proteção de Dados esclarece como exatamente fazemos isso, portanto, segue abaixo o detalhamento: 
 
Tratamento dos dados
 
2.1  Quais dados coletamos?
 
Dados pessoais: coletamos informações pessoais que o usuário preenche de forma opcional ou obrigatória, para sua identificação no aplicativo como nome, sobrenome, data de nascimento, senha, sexo, grau de parentesco responsável-paciente dentro do aplicativo, e-mail, telefone, endereço, e fotografia de perfil e informações adicionais.
 
Dados de saúde: São dados relevantes para o conhecimento da cefaleia em formato de diário de episódios de dor” que incluem informações como data, horário, localização, intensidade, característica da dor, sintomas associados, fatores desencadeantes e fatores de melhora, período menstrual, dados de perfil, de medicação, além de outras observações detalhadas que são fornecidas pelo paciente, sob auxílio e tutela de seu responsável. Outros dados sensíveis poderão ser solicitados para fins de desenvolvimento científico e tecnológico por meio de formulários próprios e discriminados. Esses dados podem ser considerados sensíveis, portanto são anonimizados.
 
2.2  Como coletamos os dados?
 
Coletamos os dados durante a interação do usuário com o aplicativo através de botões virtuais, campos para escrita livre e análise de perfil comportamental (sem identificação do usuário).
Ao coletar os dados sensíveis do usuário, removemos elementos de forma que seja impossível voltar a identificá-lo.
 
2.3  Como usamos os dados coletados?
 
Os dados tratados pela controladora do aplicativo serão utilizados para:
 
Auxílio no diagnóstico do paciente: fornecer registros e relatórios de auxílio ao profissional médico na diagnose da cefaleia do paciente.
 
Comunicação: responder dúvidas dos usuários. Para notificar os usuários sobre alterações de software, políticas de privacidade e outros assuntos de importância para ambas as partes. Para informar o usuário sobre notícias, descobertas científicas, relatórios científicos e afins.
 
Investigação médica: respeitando o anonimato de dados sensíveis, dos usuários poderão ser fornecidos a grupos de investigação selecionados e a investigadores individuais com o objetivo de estudos científicos, a fim melhorar o conhecimento da doença, os fatores que a influenciam, o impacto e a eficácia de terapias potenciais e existentes. Os resultados destes projetos de investigação podem ser apresentados em publicações, revistas e reuniões relevantes.
 
Desenvolvimento tecnológico: respeitando o anonimato de dados sensíveis, a controladora do aplicativo poderá compilar os dados anonimizados e divulgá-los para fins mercadológicos a patrocinadores ou outros parceiros de negócios, cooperando assim com desenvolvimento tecnológico e com a promoção da qualidade de vida à comunidade de pacientes com cefaleia infantil. Qualquer divulgação desse tipo a terceiros está sujeita às proteções de privacidade aqui estabelecidas.
 
Oferecimento de serviços: a controladora do aplicativo poderá utilizar publicidade e marketing de seus produtos ou serviços, ou de terceiros, durante o uso do aplicativo.
 
Para cumprimento de obrigação legal: os dados poderão ser concedidos às autoridades do país em caso de solicitação legal ou judicial.
 
Expediente interno: os dados pessoais poderão ser utilizados para fins de atendimento ao cliente, para respostas em chats e e-mails, cobranças, login e autenticação do usuário, para fins administrativos como auditorias e reorganizações, bem como para monitorar o uso devido do aplicativo dentro de nossos Termos e Condições e Políticas de Privacidade.
 
2.4  O que não fazemos com seus dados? 
 
A controladora do aplicativo não expõe dados sensíveis com identificação do usuário, nem distribui dados a bureaus de crédito. Não compartilhamos suas informações com terceiros, a não ser nas hipóteses descritas nestas Políticas de Privacidade.
 
2.5  Como armazenamos seus dados?
 
Nosso aplicativo atualmente utiliza a infraestrutura da Amazon Web Services (AWS) para armazenar os dados dos usuários de forma segura e eficiente. A AWS é reconhecida mundialmente pela sua robustez, confiabilidade e altos padrões de segurança. No entanto, embora confiemos na AWS para proteger e gerenciar os dados armazenados, não podemos nos responsabilizar por eventuais falhas, interrupções ou vulnerabilidades que possam ocorrer nos serviços da AWS. Recomendamos que os usuários estejam cientes de que, apesar de todos os esforços para garantir a segurança e a integridade dos dados, nenhuma infraestrutura de armazenamento é infalível e estão sujeitas a riscos inerentes à tecnologia.
 
Autorização para Uso e Comercialização de Dados
 
3.1  Desenvolvimento econômico e tecnológico
Com objetivo de promover o desenvolvimento econômico e tecnológico e a inovação, o usuário concorda com a coleta e o uso de seus dados para os fins mercadológicos e científicos descritos neste contrato. Nesse sentido, o usuário permite o compartilhamento de seus dados de forma anônima e agregada para fins de pesquisa, desenvolvimento e comercialização.
Se o usuário não desejar que seus dados sejam utilizados para os fins descritos nessas Políticas de Privacidade não deverá utilizar o aplicativo. 
 
3.2  Venda, fusão ou outras transações comerciais
 
Respeitado o anonimato, também podemos divulgar seus dados agregados a terceiros em situações como venda ou compra de qualquer negócio ou ativo (seja um resultado de liquidação, falência ou de outra forma), caso em que divulgaremos seus dados ao vendedor ou comprador em potencial de tal negócio ou ativo; ou se vendermos, comprarmos, fundirmos, formos adquiridos ou fizermos parceria com outras empresas ou negócios, ou vendermos alguns ou todos os nossos ativos. Em tais transações, as informações do usuário podem estar entre os ativos transferidos.
 
Privacidade infantil e Direitos do Usuário
 
Esta seção descreve nossas práticas específicas para o tratamento de dados pessoais de crianças menores de 13 anos.
 
4.1  Direitos do usuário infantil
 
O tratamento de dados pessoais de crianças e de adolescentes será realizado em seu melhor interesse, dependendo de consentimento específico e em destaque dado por pelo menos um dos pais ou pelo responsável legal, sendo que os tipos de dados coletados, a forma de sua utilização e os procedimentos para o exercício dos direitos estão descritos neste contrato.
O usuário infantil tem direito a:
 
Confirmação da existência de tratamento;
 
Acesso aos dados;
 
 
Correção de dados incompletos, inexatos ou desatualizados;
 
Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com o disposto nesta Lei;
 
Portabilidade dos dados a outro fornecedor de serviço ou produto, mediante requisição expressa e observados os segredos comercial e industrial, de acordo com a regulamentação do órgão controlador;
 
Portabilidade dos dados a outro fornecedor de serviço ou produto, mediante requisição expressa, de acordo com a regulamentação da autoridade nacional, observados os segredos comercial e industrial; 
 
Eliminação dos dados pessoais tratados com o consentimento do titular;
 
Informação das entidades públicas e privadas com as quais o controlador realizou uso compartilhado de dados;
 
Informação sobre a possibilidade de não fornecer consentimento e sobre as consequências da negativa;
 
Revogação do consentimento;
 
Para exercer esses direitos o usuário pode entrar em contato com o responsável pelo tratamento de dados através do e-mail ou telefone indicados ao final deste contrato.
 
4.2  Consentimento
 
O aplicativo foi projetado para utilização do adulto responsável juntamente com a criança. Portanto, ao aceitar nossas políticas, os pais ou responsáveis legais dão consentimento para tratarmos ou compartilharmos quaisquer dados pessoais de crianças, respeitando o anonimato e para os fins aqui descritos. 
O consentimento pode ser revogado a qualquer momento através do e-mail indicado ao final deste contrato.
Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger os dados pessoais das crianças contra acesso não autorizado, perda, alteração ou divulgação.
 
5        Responsabilidades e Limitações
 
5.1  Busca de auxílio médico
 
O presente aplicativo é um recurso tecnológico para auxílio no diagnóstico e no tratamento da cefaleia infantil, não sendo apto a fornecer diagnóstico, prognóstico, terapia ou qualquer prescrição médica. Tendo em vista sua natureza informativa, é responsabilidade do usuário buscar orientação de um profissional de saúde qualificado para diagnósticos e tratamentos.
 
5.2  Responsabilidade pelo registro dos episódios
 
É responsabilidade do usuário registrar corretamente os seus episódios de dor, o que garantirá relatórios condizentes com o quadro de saúde do paciente e fornecerá informações úteis para que o(a) profissional da área médica possa diagnosticar e prescrever o tratamento adequado.
 
5.3  Desenvolvimento tecnológico
 
O aplicativo está em constante desenvolvimento, pelo que o usuário pode encontrar eventuais falhas ou dificuldades de navegação. Caso isso ocorra, a controladora do aplicativo conta com a compreensão do usuário e pede que reporte o episódio para tratamento e correção.
 
5.4  Capturas de tela e reprodução do aplicativo
 
Muitas telas do aplicativo impedem “prints” (captura de tela) a fim de garantir a proteção de dados sensíveis dos usuários. Portanto o usuário assume ampla e total responsabilidade pela exposição, reprodução, compartilhamento ou envio de imagens ou capturas de tela que revelem seus próprios dados em quaisquer meios de comunicação.
 
Propriedade Intelectual e Licença de uso
 
A propriedade intelectual do Aplicativo é da Fundação de Ensino Superior do Vale do Sapucaí – FUVS/Universidade do Vale do Sapucaí – UNIVÁS, regido pela legislação do INPI e de Direitos Autorais.
O usuário tem a concessão de uma licença limitada para usar o aplicativo de acordo com os Termos de Uso e as Políticas de Privacidade ora consignadas. Entretanto, é terminantemente vedada a cópia, engenharia reversa ou desenvolvimento de formas semelhantes de aplicação. Também é terminantemente vedada a cópia ou reprodução de recursos audiovisuais, identidade visual, logomarca, personagens, jargões, músicas ou qualquer outro elemento do aplicativo para fins comerciais sem autorização expressa da controladora do aplicativo, uma vez que protegidos pela legislação de direitos autorais.
 
Alterações das Políticas de Privacidade
 
Essa Política de Privacidade pode mudar a qualquer momento e a utilização dos nossos serviços será considerada concordância tácita das alterações, portanto é responsabilidade do usuário revisá-las constantemente. Ainda assim, sempre utilizaremos nossos canais de comunicação para dar publicidade sobre tais mudanças.
 
Como entrar em contato conosco 
 
Para dúvidas ou solicitações relacionadas à privacidade de dados de crianças, os pais ou responsáveis entre em contato conosco pelo e-mailenxaqueoque@gmail.com ou pelo telefone (35) 99806-0109.
          `}
        </Text>
      </ScrollView>
    </AppPageScaffold>
  );
};

export default PrivacyPolicy;
