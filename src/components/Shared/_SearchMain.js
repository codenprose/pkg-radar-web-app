import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { withStyles } from 'material-ui/styles';
import { withRouter } from 'react-router-dom';
import elasticsearch from 'elasticsearch'
import Humanize from "humanize-plus";

const client = new elasticsearch.Client({
  host: 'https://search-pkg-radar-dev-packages-bfnemqricttw7m2gal2aecwqze.us-east-1.es.amazonaws.com'
});

function renderInput(inputProps) {
  const { classes, home, value, ref, ...other } = inputProps;

  return (
    <input
      autoFocus={true}
      className={classes.textField}
      value={value}
      { ...other }
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion._source.package_name, query);
  const parts = parse(suggestion._source.package_name, matches);

  return (
    <MenuItem 
      selected={isHighlighted}
      style={{ height: 'auto' }}
      component="div"
    >
      <div>
        <img
          src={suggestion._source.owner_avatar}
          style={{
            height: '40px',
            marginRight: '10px',
            width: '40px',
            verticalAlign: 'text-bottom'
          }}
          alt="search-result"
        />
        <div className='dib'>
          {parts.map((part, index) => {
            return part.highlight
              ? <span key={index} style={{ background: 'yellow', fontSize: '20px', fontWeight: 300 }}>
                  {part.text}
                </span>
              : <strong key={index} style={{ fontWeight: 500, fontSize: '20px' }}>
                  {part.text}
                </strong>;
          })}
          <i className="fa fa-star ml3 mr1" aria-hidden="true" />
          <span className='mr2'>{Humanize.formatNumber(suggestion._source.stars)}</span>
          <i className="fa fa-exclamation-circle fa-fw mr1" aria-hidden="true" />
          <span>{Humanize.formatNumber(suggestion._source.issues)}</span>
          
          <div style={{ lineHeight: '16px' }}>
            <span>tags: </span>
            <ul className='list dib pa0'>
              {
                suggestion._source.tags.map(tag => {
                  const matches = match(tag, query);
                  const parts = parse(tag, matches);

                  return ( 
                    <li key={tag} className='dib mr2'>
                      {parts.map((part, index) => {
                        return part.highlight
                          ? <span key={index} style={{ background: 'yellow' }}>
                              {part.text}
                            </span>
                          : <span key={index}>
                              {part.text}
                            </span>;
                      })}
                    </li> 
                  )
                })
              }
            </ul>
          </div>
        </div>
      </div>
    </MenuItem>
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

const getSuggestionValue = suggestion => suggestion._source.package_name

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
    height: '100%'
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 5,
    marginTop: '11px',
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  textField: {
    width: '100%',
    height: '100%',
    outline: 'none',
    border: 'none',
    background: 'none',
    paddingLeft: '16px'
  },
});

class SearchMain extends Component {
  state = {
    value: '',
    suggestions: [],
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    const inputValue = value.trim().toLowerCase();
    client.search({
      index: 'packages',
      type: 'package-details',
      body: {
        query: {
          query_string: {
            query: `${inputValue}*`
          },
        }
      }
    }).then(body => {
      const hits = body.hits.hits
      // console.log('hits', hits)
      if (hits.length) {
        this.setState({ suggestions: hits })
      } else {
        this.setState({ suggestions: [] })
      }
    }, error => {
      console.trace(error.message);
    })
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleSuggestionSelected = (event, response) => {
    const { package_name, owner_name } = response.suggestion._source
    this.props.history.push(`/${owner_name}/${package_name}`)
  }

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue,  
    });
  };

  render() {
    const { classes, id, placeholder } = this.props;

    return (
      <div 
        id={id}
        style={{ height: '100%' }}
      >
        <Autosuggest
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion,
          }}
          renderInputComponent={renderInput}
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
          onSuggestionSelected={this.handleSuggestionSelected}
          renderSuggestionsContainer={renderSuggestionsContainer}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={{
            autoFocus: true,
            placeholder: placeholder ? placeholder : '',
            classes,
            value: this.state.value,
            onChange: this.handleChange
          }}
        />
      </div>
    );
  }
}

SearchMain.propTypes = {
  classes: PropTypes.object.isRequired,
};

SearchMain.defaultProps = {
  id: 'SearchMain'
}

export default withRouter(withStyles(styles)(SearchMain));