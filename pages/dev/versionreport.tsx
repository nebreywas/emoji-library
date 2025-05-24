import Link from 'next/link';
import fs from 'fs';
import path from 'path';

/**
 * Version Report page: lists all dependencies and their versions.
 * Data is securely loaded on the server using getServerSideProps.
 * UI is fully compliant with AllSpark UI spec (DaisyUI + .app-*-base classes)
 */
interface VersionReportProps {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

const VersionReport: React.FC<VersionReportProps> = ({ dependencies, devDependencies }) => {
  return (
    <>
      {/* Top Menu Bar */}
      <nav className="w-full fixed top-0 left-0 bg-base-200 border-b border-base-300 z-50 flex items-center justify-center h-14 shadow-sm">
        <div className="flex gap-6">
          <Link href="/dev" legacyBehavior>
            <a className="btn btn-ghost app-btn-base">Dev Console</a>
          </Link>
          <Link href="/test" legacyBehavior>
            <a className="btn btn-ghost app-btn-base">Test Home</a>
          </Link>
        </div>
      </nav>
      {/* Main Content (with padding for menu bar) */}
      <main className="min-h-screen bg-base-100 flex flex-col items-center p-4 pt-16">
        <div className="max-w-2xl w-full flex flex-col gap-2">
          <div className="card app-card-base bg-base-200">
            <div className="card-body">
              <h1 className="app-section-header-base text-lg mb-2">Full Version Report</h1>
              <Link href="/dev" legacyBehavior>
                <a className="app-link-base mb-2 inline-block text-sm">&larr; Back to Dev Console</a>
              </Link>
              <div className="mb-2">
                <h2 className="app-section-header-base text-lg mb-1">Dependencies</h2>
                <ul className="mb-2">
                  {Object.entries(dependencies).map(([name, version]) => (
                    <li key={name} className="flex justify-between border-b py-1 text-sm">
                      <span>{name}</span>
                      <span className="text-gray-700">{String(version).replace('^', '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {Object.keys(devDependencies).length > 0 && (
                <div>
                  <h2 className="app-section-header-base text-lg mb-1 mt-2">Dev Dependencies</h2>
                  <ul>
                    {Object.entries(devDependencies).map(([name, version]) => (
                      <li key={name} className="flex justify-between border-b py-1 text-sm">
                        <span>{name}</span>
                        <span className="text-gray-700">{String(version).replace('^', '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default VersionReport;

// Server-side data fetching for security
export async function getServerSideProps() {
  let dependencies = {};
  let devDependencies = {};
  try {
    const pkgPath = path.join(process.cwd(), 'package.json');
    const pkgRaw = fs.readFileSync(pkgPath, 'utf-8');
    const pkgJson = JSON.parse(pkgRaw);
    dependencies = pkgJson.dependencies || {};
    devDependencies = pkgJson.devDependencies || {};
  } catch (e) {
    // Handle error or leave as empty
  }
  return {
    props: {
      dependencies,
      devDependencies,
    },
  };
} 