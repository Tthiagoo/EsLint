let cnPacienteInputt = fProp(
  'frmshc.ProntuarioPaciente.Corpo.FmeRegistros.DadosPaciente.ImformacaoPaciente.cnPaciente',
  'value'
);
async function ajaxStatus(cnPaciente) {
  const url =
    cc.url.ccasegd_token +
    'TABELA=shcStatusMovimentacao&COLUNAS=id,cnPaciente,cnStatusMovimentacao,cnStatusPaciente,dtMovimentacaoStatus,hrMovimentacaoStatus&WHERE=cnPaciente=' +
    cnPaciente +
    '&ORDERBY=dtMovimentacaoStatus DESC';

  try {
    const response = await $.ajax({
      method: 'GET',
      url,
    });

    const { data } = response;
    const {
      0: {
        cnPaciente,
        cnStatusMovimentacao: stsSeqFirst,
        cnStatusPaciente: stsPacFirst,
        dtMovimentacaoStatus: dtFirst,
        hrMovimentacaoStatus: hrFisrt,
      },
    } = data;
    const second = data[1];
    console.log(second);
    if (second) {
      const {
        1: {
          dtMovimentacaoStatus: dtSecond,
          hrMovimentacaoStatus: hrSecond,
          cnStatusPaciente: stsPacSecond,
          cnStatusMovimentacao: stsSeqSecond,
        },
      } = data;

      console.log(
        'FIRST:  ' + 'cn Paciente: ' + cnPaciente,
        '  seq status: ' + stsSeqFirst,
        '  cn status: ' + stsPacFirst,
        '  data: ' + dtFirst,
        '  hora: ' + hrFisrt
      );

      console.log('second: ' + dtSecond, hrSecond);

      let stsInput = fProp(
        'frmshc.ProntuarioPaciente.Corpo.FmeRegistros.DadosPaciente.ImformacaoPaciente.dcSituacao',
        'value'
      );

      const checkDt = moment(dtFirst).isSame(dtSecond); // verifica se as datas sao iguais
      console.log(checkDt);

      if (checkDt) {
        //se for true

        const hrCheckSame = moment(hrFisrt, 'H:m').isSame(
          moment(hrSecond, 'H:m')
        );
        console.log('verifica se as horas são iguiais', hrCheckSame);

        if (!hrCheckSame) {
          const hrCheckBigger = moment(hrFisrt, 'H:m').isBefore(
            moment(hrSecond, 'H:m')
          );

          stsInput = hrCheckBigger ? stsPacSecond : stsPacFirst;
          fProp(
            'frmshc.ProntuarioPaciente.Corpo.FmeRegistros.DadosPaciente.ImformacaoPaciente.dcSituacao',
            'value',
            stsInput
          );
        } else {
          //se data e horas são iguais
          stsInput = stsSeqFirst > stsSeqSecond ? stsPacFirst : stsPacSecond;
        }
      } else {
        console.log('datas não são iguais');
        stsInput = stsPacFirst;
        fProp(
          'frmshc.ProntuarioPaciente.Corpo.FmeRegistros.DadosPaciente.ImformacaoPaciente.dcSituacao',
          'value',
          stsInput
        );
      }
    } else {
      console.log('sem data[1]');
      stsInput = stsPacFirst;
      fProp(
        'frmshc.ProntuarioPaciente.Corpo.FmeRegistros.DadosPaciente.ImformacaoPaciente.dcSituacao',
        'value',
        stsInput
      );
    }
  } catch (error) {
    console.log(error);
  }
}
ajaxStatus(cnPacienteInputt);
