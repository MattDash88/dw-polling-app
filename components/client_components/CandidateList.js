import React from 'react';
import { 
  Grid,
  Checkbox,
} from 'semantic-ui-react';

const CandidateList = props => {
  const { candidates, onChange } = props;
  const ballotOptions = candidates.map(({ key, value, text, alias }) => {
    let label = text;
    if (alias.length > 0) {
      label = `${text} - ${alias}`;
    }
    return (
      <Grid.Row key={key}>
        <Checkbox value={value} label={label} onChange={onChange} />
      </Grid.Row>
    );
  });
  return <Grid padded>{ballotOptions}</Grid>;
};

export default CandidateList;