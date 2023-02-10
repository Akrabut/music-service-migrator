export function filterFailedIDResults(results: PromiseSettledResult<any>[]) {
  return results.reduce((successfulResults: any[], result: PromiseSettledResult<any>) => {
    if (result.status === 'fulfilled') {
      successfulResults.push(result.value);
    }

    return successfulResults;
  }, []);
}
