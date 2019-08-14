const requireAll = requireContext => requireContext.keys().map(requireContext);
const req = require.context('./', false, /\.png$/);
requireAll(req);
