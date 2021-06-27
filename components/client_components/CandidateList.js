import React from 'react';
import {
  Grid,
  Checkbox,
  Icon,
  Popup,
} from 'semantic-ui-react';

const CandidateList = props => {
  const { candidates, onChange } = props;
  const ballotOptions = candidates.map(({ key, value, text, alias }) => {
    let label = text;
    if (alias.length > 0) {
      label = `${text} - ${alias}`;
    } else if (key == 'name3') {
      label = `${text} - (The candidate requested to keep their full name confidential unless they are elected)`;
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