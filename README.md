hexo-broken-link-checker
========================

Detects links that don't work, missing images and redirects.

recolecta links cuando se genera el blog
  -> a storage
    -> pasa BrokenLinkChecker el contexto del link (el tag completo)
       y el source (titulo, link y archivo.md)
    -> se analiza si el link ya existe en db
      -> Si: next
      -> No: se descompone el link (url, anchor, tipo)
         Se arma el schema
         A storage

cuando se le da a scan manual
