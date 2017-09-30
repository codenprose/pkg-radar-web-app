import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { withStyles } from 'material-ui/styles';
import { withRouter } from 'react-router-dom';
import Humanize from "humanize-plus";

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
  if (suggestion.inputValue) {
    return (
      <MenuItem
        selected={isHighlighted}
        style={{ height: 'auto' }}
        component="div"
      >
        <div>
          <span style={{ fontSize: '20px', color: '#2196F3' }}>
            {suggestion.inputValue}
          </span>
        </div>
      </MenuItem>
    )
  }

  if (suggestion.notFound) {
    return (
      <MenuItem
        style={{ height: 'auto' }}
        component="div"
      >
        <div>
          <span style={{ fontSize: '16px' }}>
            {suggestion.notFound}
          </span>
        </div>
      </MenuItem>
    )
  }

  if (suggestion._type === 'packages') {
    const matches = match(suggestion._source.package_name, query);
    const parts = parse(suggestion._source.package_name, matches);

    return (
      <MenuItem
        selected={isHighlighted}
        style={{ height: 'auto', padding: '10px 16px' }}
        component="div"
      >
        <div>
          <img
            src={suggestion._source.owner_avatar}
            style={{
              height: '25px',
              marginRight: '10px',
              width: '25px',
              verticalAlign: 'bottom'
            }}
            alt="search-result"
          />
          <div className='dib'>
            {parts.map((part, index) => {
              return part.highlight
                ? <span key={index} style={{ fontSize: '20px', color: '#2196F3' }}>
                    {part.text}
                  </span>
                : <strong key={index} style={{ fontSize: '20px' }}>
                    {part.text}
                  </strong>;
            })}
            <i className="fa fa-star ml3 mr1" aria-hidden="true" />
            <span className='mr2'>{Humanize.formatNumber(suggestion._source.stars)}</span>
          </div>
        </div>
      </MenuItem>
    );
  } else if (suggestion._type === 'users') {
    const matchesUsername = match(suggestion._source.username, query);
    const partsUsername = parse(suggestion._source.username, matchesUsername);

    const matchesName = match(suggestion._source.name, query);
    const partsName = parse(suggestion._source.name, matchesName);

    return (
      <MenuItem
        selected={isHighlighted}
        style={{ height: 'auto' }}
        component="div"
      >
        <div>
          <img
            src={suggestion._source.avatar}
            style={{
              height: '40px',
              marginRight: '10px',
              width: '40px',
              verticalAlign: 'text-bottom'
            }}
            alt="search-result"
          />
          <div className='dib'>
            <strong style={{ fontSize: '20px' }}>@</strong>
            {partsUsername.map((part, index) => {
              return part.highlight
                ? <span key={index} style={{ fontSize: '20px', color: '#2196F3' }}>
                    {part.text}
                  </span>
                : <strong key={index} style={{ fontSize: '20px' }}>
                    {part.text}
                  </strong>;
            })}
            <div style={{ lineHeight: '16px' }}>
              <span>name: </span>
              <ul className='list dib pa0'>
                <li>
                  {partsName.map((part, index) => {
                    return part.highlight
                      ? <span key={index} style={{ color: '#2196F3' }}>
                          {part.text}
                        </span>
                      : <span key={index}>
                          {part.text}
                        </span>;
                  })}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </MenuItem>
    );
  }
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

const getSuggestionValue = suggestion => {
  if (suggestion._type === 'packages') {
    return suggestion._source.package_name
  } else if (suggestion._type === 'users') {
    return suggestion._source.username
  } else if (suggestion.inputValue) {
    return suggestion.inputValue
  } else {
    return suggestion.notFound
  }
}

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

  handleSuggestionsFetchRequested = async ({ value }) => {
    try {
      const inputValue = value.trim().toLowerCase();

      const endpoint = `${process.env.ELASTIC_SEARCH_ENDPOINT}/_search`;
      const body = {
        from : 0,
        size : 40,
        query: {
          query_string: {
            fields : ["package_name^2", "owner_name", "tags^2", "username", "name", "language"],
            default_operator: 'AND',
            query: `${inputValue}*`
          },
        },
        sort: [
          {"stars" : {"order" : "desc", "unmapped_type" : "long"}}
       ]
      };

      const options = {
        method: 'POST',
        'Content-Type': 'application/json',
        body: JSON.stringify(body)
      }

      const response = await fetch(endpoint, options);
      const json = await response.json();

      const hits = json.hits.hits;
      if (hits.length) {
        this.setState({ suggestions: [{ inputValue }, ...hits] })
      } else {
        const notFound = "Can't find a pkg? My bad... Login to add what we left out."
        this.setState({ suggestions: [{ inputValue }, { notFound }] })
      }
    } catch (e) {
      console.error(e);
    }
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleSuggestionSelected = (event, response) => {
    if (response.suggestion._type === 'packages') {
      const { package_name, owner_name } = response.suggestion._source
      this.props.history.push(`/${owner_name}/${package_name}`)
    } else if (response.suggestion._type === 'users') {
      const { username } = response.suggestion._source
      this.props.history.push(`/@${username}`)
    } else if (response.suggestion.inputValue) {
      const query = response.suggestion.inputValue.replace(/\s/g, '+')
      this.props.history.push(`/search?q=${query}`)
    } else {
      return
    }
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
          focusInputOnSuggestionClick={false}
          highlightFirstSuggestion
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
