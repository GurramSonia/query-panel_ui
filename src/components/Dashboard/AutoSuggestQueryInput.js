import React, { useState, useEffect, useRef } from "react";

const AutoSuggestQueryInput = ({
  fetchTables,
  fetchPreviousQueries,
  query,
  setQuery,
  setResults,
  submitted,
  setSubmitted,
  connectionURI,
  database,
  results,
  databases_names
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [tables, setTables] = useState([]);
  const [previousQueries, setPreviousQueries] = useState([]);
  const [inlineSuggestion, setInlineSuggestion] = useState(""); // Ghost text
  const inputRef = useRef(null);
  const databasePlaceholders = {
    mysql: 'Write your MySQL query (e.g., SELECT * FROM table)',
    mongodb: 'Write your MongoDB query (e.g., db.collection.find({}) )',
   
  };
  const sqlKeywords = [
    "SELECT", "FROM", "WHERE", "INSERT INTO", "UPDATE", "DELETE",
    "ORDER BY", "GROUP BY", "HAVING", "JOIN", "LEFT JOIN", "RIGHT JOIN",
    "INNER JOIN", "OUTER JOIN", "CREATE TABLE", "ALTER TABLE", "DROP TABLE"
  ];
  const mongoKeywords = [
    "find({})",
    "find_one({})",
    "insert_one({})",
    "insert_many([])",
    "update_one({}, { $set: {} })",
    "update_many({}, { $set: {} })",
    "delete_one({})",
    "delete_many({})",
    "drop()"
  ];

  useEffect(() => {
    if (connectionURI&&(database === "mysql" || database === "mongodb") ) {
      const loadSuggestions = async () => {
        try {
          const tablesData = await fetchTables();
          const previousQueriesData = await fetchPreviousQueries();
          console.log(tablesData,previousQueriesData)

          setTables(tablesData || []);
          setPreviousQueries([...new Set(previousQueriesData)] || []);
        } catch (error) {
          console.error("Error loading suggestions:", error);
        }
      };
      loadSuggestions();
    }
  }, [connectionURI, database]);
  useEffect(() => {
    if ((database === "mysql" || database === "mongodb") && (databases_names!="selectDatabase"&&databases_names!="")) {
      console.log("databases_names",databases_names)
      const loadSuggestions = async () => {
        try {
          const tablesData = await fetchTables();
          const previousQueriesData = await fetchPreviousQueries();
          console.log(tablesData,previousQueriesData)
          

          setTables(tablesData || []);
          setPreviousQueries([...new Set(previousQueriesData)] || []);
        } catch (error) {
          console.error("Error loading suggestions:", error);
        }
      };
      loadSuggestions();
    }
  }, [databases_names, database]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      console.log("RESULTS are ",results)
      setSuggestions([]);
      setInlineSuggestion("");
      return;
    }
   /*  else {
      setResults([]);
    } */

    if (submitted) {
      //setQuery("");
      setSubmitted(false);
    }

    let matchedSuggestions = [];

    if (database === "mysql") {
      const words = value.split(/\s+/);
      const lastWord = words[words.length - 1];
      const lastKeyword = words.length > 1 ? words[words.length - 2].toUpperCase() : "";
      console.log(words.length)
      console.log("lastword is",lastWord,"last keyword is",lastKeyword)

      // Suggest SQL keywords
       if (lastWord.length > 0) {
        matchedSuggestions = sqlKeywords.filter((kw) => kw.startsWith(lastWord));
    } 

    if (["FROM", "INTO", "TABLE", "UPDATE"].includes(lastKeyword)) {
        console.log("IFf")
          if (lastWord === "") {
              matchedSuggestions = tables;
              console.log("1IFFFF")
          }
           else {
              matchedSuggestions = tables.filter((table) => table.toLowerCase().startsWith(lastWord));
              console.log("ELSE")
            }

      }
    }

    else if (database === "mongodb") {
      if (value.startsWith("db.")) {
        const match = value.match(/^db\.(\w*)\.?(\w*)$/);
        const collectionName = match ? match[1] : "";
        const operation = match ? match[2] : "";

        if (!collectionName) {
          // If only `db.` is typed, suggest collections
          matchedSuggestions = tables.map((table) => `db.${table}`);
        }
        else if (collectionName && (!operation || value.endsWith("."))) {
            // ✅ Show matching collections (if user is typing collection name)
            matchedSuggestions = tables
                .filter((table) => table.toLowerCase().startsWith(collectionName.toLowerCase()))
                .map((table) => `db.${table}`);
        
            // ✅ If input ends with '.', also suggest MongoDB operations
            if (value.endsWith(".")) {
                matchedSuggestions = mongoKeywords.map((cmd) => `db.${collectionName}.${cmd}`);
            }
        }
       
         else if (collectionName && operation) {
          // Filter operations based on partial input
          matchedSuggestions = mongoKeywords
            .filter((cmd) => cmd.startsWith(operation))
            .map((cmd) => `db.${collectionName}.${cmd}`);
        }
      }
    }

    // Match previous queries
    const previousQueryMatch = previousQueries.find((pq) => pq.startsWith(value));
    if (database==="mysql"){
      const words = value.split(/\s+/);
      const lastWord = words[words.length - 1];
    if (previousQueryMatch) {
      setInlineSuggestion(previousQueryMatch.slice(value.length));
    } 
      else if (matchedSuggestions.length > 0) {
        if (!lastWord || lastWord === "") {
            setInlineSuggestion(matchedSuggestions[0]); // Show full table name if lastWord is empty
        } else {
            setInlineSuggestion(matchedSuggestions[0].slice(lastWord.length));
        }}
         else {
      setInlineSuggestion(""); // ✅ Clear ghost text if no match
    }

    setSuggestions(matchedSuggestions);
  }
  if (database==="mongodb"){
    if (previousQueryMatch) {
      setInlineSuggestion(previousQueryMatch.slice(value.length));
    } else if (matchedSuggestions.length > 0) {
      setInlineSuggestion(matchedSuggestions[0].slice(value.length));
    } else {
      setInlineSuggestion("");
    }

    setSuggestions(matchedSuggestions);
  };
}

  const handleKeyDown = (e) => {
    if (e.key === "Tab" && inlineSuggestion) {
      e.preventDefault();
      const cursorIndex = inputRef.current.selectionStart;

      // Insert inline suggestion
      const newQuery = query + inlineSuggestion;
      setQuery(newQuery);
      setSuggestions([]);
      setInlineSuggestion("");

      // Move cursor to the end
      setTimeout(() => {
        inputRef.current.setSelectionRange(cursorIndex + inlineSuggestion.length, cursorIndex + inlineSuggestion.length);
      }, 0);
    }
  };

  return (
    <div className="autocomplete-container">
      <div className="input-wrapper">
        <div className="input-overlay">{query}<span className="ghost-text">{inlineSuggestion}</span></div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          required
          placeholder={databasePlaceholders[database] || 'Enter your query'} 
          className="query-input"
        />
      </div>
    </div>
  );
};

export default AutoSuggestQueryInput;
